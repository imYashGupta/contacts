<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => ['nullable', 'string'],
            'gender' => ['nullable', 'string', 'in:MALE,FEMALE,ALL'],
        ]);

        if ($validator->fails()) {
            return redirect()->route('dashboard');
        }

        $contacts = $request->user()->contacts()->whereNull('merged_into')->with(['customFields']);

        if ($request->has('search')) {
            $searchTerm = "%{$request->search}%";

            $contacts->whereAny(
                ['name', 'emails', 'phone_numbers'],
                'LIKE',
                $searchTerm
            )->orWhereHas('customFields', function ($query) use ($searchTerm) {
                $query->where('value', 'LIKE', $searchTerm);
            });
        }

        // Filter by gender
        if ($request->filled('gender') && $request->gender !== 'ALL') {
            $contacts->where('gender', $request->gender);
        }

        return inertia('Dashboard', [
            'contacts' => $contacts->get(),
            'filters' => $validator->validated(),
        ]);
    }


    public function store(CreateContactRequest $request)
    {
        DB::transaction(function () use ($request) {
            $contact = $request->user()->contacts()->create([
                'name' => $request->name,
                'emails' => $request->emails,
                'phone_numbers' => $request->phone_numbers,
                'gender' => $request->gender,
                'profile_photo' => $request->file('profile_photo')->store(
                    'profile_photos/' . $request->user()->id,
                    'public'
                ),
                'file' => $request->file('additional_file')->storeAs(
                    'files/' . $request->user()->id,
                    $request->file('additional_file')->getClientOriginalName(),
                    'public'
                ),
            ]);

            foreach ($request->custom_fields as $field) {
                $contact->customFields()->create([
                    'type' => $field['type'],
                    'name' => $field['name'],
                    'value' => $field['value'],
                ]);
            }
            return $contact;
        });

        return redirect()->back();
    }

    public function update(Request $request, Contact $contact)
    {

        $request->dump();
        DB::transaction(function () use ($request, $contact) {
            $contact->name = $request->name;
            $contact->emails = $request->emails;
            $contact->phone_numbers = $request->phone_numbers;
            $contact->gender = $request->gender;
            if ($request->hasFile('profile_photo')) {
                $contact->profile_photo = $request->file('profile_photo')->store(
                    'profile_photos/' . $request->user()->id,
                    'public'
                );
            }
            if ($request->hasFile('additional_file')) {
                $contact->file = $request->file('additional_file')->storeAs(
                    'files/' . $request->user()->id,
                    $request->file('additional_file')->getClientOriginalName(),
                    'public'
                );
            }
            $contact->save();

            $existingFieldIds = $contact->customFields()->pluck('id')->toArray();

            $incomingFields = collect($request->custom_fields);
            $incomingFieldIds = $incomingFields->pluck('id')->filter()->toArray();

            // delete fields.
            $fieldsToDelete = array_diff($existingFieldIds, $incomingFieldIds);
            $contact->customFields()->whereIn('id', $fieldsToDelete)->delete();

            // update/create fields
            $incomingFields->each(function ($field) use ($contact) {
                $data = Arr::only($field, ['type', 'name', 'value']);
                if (!empty($field['id'])) {
                    $contact->customFields()->updateOrCreate(['id' => $field['id']], $data);
                } else {
                    $contact->customFields()->create($data);
                }
            });
        });

        return redirect()->back();
    }

    public function merge(Request $request)
    {
        $request->validate([
            'primary_contact' => ['required', 'exists:contacts,id'],
            'secondary_contact' => ['required', 'exists:contacts,id'],
        ]);

        $primaryContact = Contact::find($request->primary_contact);
        $secondaryContact = Contact::find($request->secondary_contact);

        $primaryContact->emails = array_values(array_unique(array_merge(
            $primaryContact->emails,
            $secondaryContact->emails
        )));
        $primaryContact->phone_numbers = array_values(array_unique(array_merge(
            $primaryContact->phone_numbers,
            $secondaryContact->phone_numbers
        )));

        $secondaryContact->customFields()->update([
            'contact_id' => $primaryContact->id,
        ]);
        $primaryContact->save();
        $secondaryContact->update([
            'merged_into' => $primaryContact->id,
        ]);

        return redirect()->back();
    }
}
