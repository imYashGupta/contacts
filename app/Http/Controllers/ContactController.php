<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
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
            // Reset the search and redirect
            return redirect()->route('dashboard');
        }

        // Start query with user's contacts
        $contacts = $request->user()->contacts()->with(['customFields']);

        // Search in `contacts` table
        if ($request->has('search')) {
            $searchTerm = "%{$request->search}%";

            $contacts->whereAny(
                ['name', 'email', 'phone'],
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
                'email' => $request->email,
                'phone' => $request->phone,
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
            $contact->email = $request->email;
            $contact->phone = $request->phone;
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

            foreach ($request->custom_fields as $field) {
                if (isset($field['id'])) {
                    $contact->customFields()->updateOrCreate(
                        ['id' => $field['id']],
                        [
                            'type' => $field['type'],
                            'name' => $field['name'],
                            'value' => $field['value'],
                        ]
                    );
                } else {
                    $contact->customFields()->create([
                        'type' => $field['type'],
                        'name' => $field['name'],
                        'value' => $field['value'],
                    ]);
                }
            }
        });

        return redirect()->back();
    }
}
