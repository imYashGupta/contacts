<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CreateContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', Rule::in(['MALE', 'FEMALE'])],
            #TODO: shd be mimeTypes validation 
            'profile_photo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:1024'],
            'additional_file' => ['required', 'file', 'max:1024'],
            'custom_fields' => ['required', 'array'],
            'custom_fields.*.type' => ['required', Rule::in(['text', 'number', 'date'])],
            'custom_fields.*.name' => ['required', 'string', 'max:255'],
            'custom_fields.*.value' => [
                'required',
                'max:255',
                Rule::when(fn($input) => $input['type'] === 'number', ['integer']),
                Rule::when(fn($input) => $input['type'] === 'date', ['date']),
            ],
        ];
    }
}
