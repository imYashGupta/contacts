import React, { useEffect, useState } from 'react'
import InputLabel from './InputLabel'
import TextInput from './TextInput'
import InputError from './InputError'
import PrimaryButton from './PrimaryButton'
import { useForm } from '@inertiajs/react'
import { DocumentPlusIcon, TrashIcon, DocumentCheckIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { Contact } from '@/types/Contact'

type Props = {
    editableContact: Contact | null
    onClose: () => void
}
const genders = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
]
const ContactCreateForm = ({ editableContact: contact, onClose }: Props) => {
    const form = useForm({
        name: '',
        gender: '',
        profile_photo: '',
        additional_file: '',
        custom_fields: [],
        emails: [""],
        phone_numbers: [""],

    });
    console.log(form.data)

    const handleAddField = (e) => {
        e.preventDefault();
        form.setData((data) => ({
            ...data,
            custom_fields: [...data.custom_fields, { type: 'text', name: '', value: '' }]
        }));
    }

    const handleCustomFieldChange = (index: number, key: string, value: string) => {
        let fields = [...form.data.custom_fields]
        fields[index][key] = value
        if (key === 'type') {
            fields[index].value = ''
        }
        form.setData('custom_fields', fields)
    }

    const handleCustomFieldRemove = (index) => {
        let fields = [...form.data.custom_fields]
        fields.splice(index, 1)
        form.setData('custom_fields', fields)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.data);
        form.post(contact ? route('contacts.update', [contact]) : route('contacts.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            }
        });

    }

    useEffect(() => {
        if (contact) {
            form.setData((data) => ({
                ...data,
                _method: 'PATCH',
                name: contact.name,
                emails: contact.emails,
                phone_numbers: contact.phone_numbers,
                gender: contact.gender,
                // profile_photo: contact.profile_photo,
                custom_fields: contact.custom_fields,

            }));
        }
    }, [contact])

    return (
        <div className='max-h-[650px] overflow-y-auto    '>
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 ">
                <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Contact</h3>

                    </div>

                </div>
            </div>
            <div className='grid grid-cols-12 p-6 gap-6  '>
                <div className='col-span-6'>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        onChange={(e) => form.setData('name', e.target.value)}
                        value={form.data.name}
                    />
                    <InputError className="mt-2" message={form.errors.name} />
                </div>
                <div className='col-span-6'>
                    <InputLabel htmlFor="gender" value="Gender" />
                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10 p-4">
                        {genders.map((gender) => (
                            <div key={gender.value} className="flex items-center">
                                <input
                                    id={gender.value}
                                    name="notification-method"
                                    type="radio"
                                    checked={form.data.gender === gender.value}
                                    value={gender.value}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={(e) => form.setData('gender', e.target.value)}
                                />
                                <label htmlFor={gender.value} className="ml-3 block text-sm font-medium text-gray-700">
                                    {gender.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    <InputError className="mt-2" message={form.errors.gender} />
                </div>
                <div className='col-span-12 border-t pt-4'>
                    <h1>Email</h1>
                    {form.data.emails.map((email, i) => <div className='flex'>
                        <div className='w-full'>
                            <TextInput
                                id={"email" + i}
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    let emails = [...form.data.emails]
                                    emails[i] = e.target.value
                                    form.setData('emails', emails)
                                }}
                                value={email}
                                type='email'
                            />
                            <InputError className="mt-2" message={form?.errors[`emails.${i}`] || ''} />
                        </div>
                        {form.data.emails.length == i + 1 ? <div className='flex items-center justify-center ml-2'>
                            <PlusCircleIcon onClick={() => {
                                let emails = [...form.data.emails]
                                emails.push('')
                                form.setData('emails', emails)
                            }} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                        </div> : <div className='flex items-center justify-center ml-2'>
                            <TrashIcon onClick={() => {
                                let emails = [...form.data.emails]
                                emails.splice(i, 1)
                                form.setData('emails', emails)
                            }} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                        </div>}
                    </div>)}
                </div>
                <div className='col-span-12 border-t pt-4'>
                    <h1>Phone Numbers</h1>
                    {form.data.phone_numbers.map((phone, i) => <div className='flex'>
                        <div className='w-full'>
                            <TextInput
                                id={"phone" + i}
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    let phone_numbers = [...form.data.phone_numbers]
                                    phone_numbers[i] = e.target.value
                                    form.setData('phone_numbers', phone_numbers)
                                }}
                                value={phone}
                                type='tel'
                            />
                            <InputError className="mt-2" message={form?.errors[`phone_numbers.${i}`] || ''} />
                        </div>
                        {form.data.phone_numbers.length == i + 1 ? <div className='flex items-center justify-center ml-2'>
                            <PlusCircleIcon onClick={() => {
                                let phone_numbers = [...form.data.phone_numbers]
                                phone_numbers.push('')
                                form.setData('phone_numbers', phone_numbers)
                            }} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                        </div> : <div className='flex items-center justify-center ml-2'>
                            <TrashIcon onClick={() => {
                                let phone_numbers = [...form.data.phone_numbers]
                                phone_numbers.splice(i, 1)
                                form.setData('phone_numbers', phone_numbers)
                            }} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                        </div>}
                    </div>)}
                </div>


                <div className='col-span-12'>
                    <InputLabel htmlFor="address" value="Profile Photo" />
                    <div className="mt-2">
                        <div className="flex items-center">
                            <span className="size-24 overflow-hidden rounded-full bg-gray-100">
                                {form.data.profile_photo != '' || contact ? <img src={form.data.profile_photo != '' ? URL.createObjectURL(form?.data?.profile_photo) : contact.profile_photo} alt="" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>}
                            </span>
                            <button
                                type="button"
                                className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => document.getElementById('profile-photo-upload')?.click()}
                            >
                                Change
                            </button>
                            <input id="profile-photo-upload" type="file" className='hidden' onChange={(e) => form.setData('profile_photo', e.target.files[0])} />
                        </div>
                        <InputError className="mt-2" message={form.errors.profile_photo} />

                    </div>
                </div>
                <div className='col-span-12'>
                    <InputLabel htmlFor="gender" className='mb-2' value="Additional File" />
                    <div className="flex  justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        {form.data.additional_file != '' || contact ? <div>
                            <DocumentCheckIcon className="mx-auto h-12 w-12 text-indigo-400" />
                            <span>{form.data.additional_file != '' ? form.data.additional_file?.name : contact.file}</span>
                            <div className='text-center'>
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Change File</span>
                                    <input onChange={(e) => form.setData('additional_file', e.target.files[0])} id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                            </div>
                        </div> : <div className="space-y-1 text-center">
                            <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input onChange={(e) => form.setData('additional_file', e.target.files[0])} id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>}
                    </div>
                    <InputError className="mt-2" message={form.errors.additional_file} />

                </div>
                {form.data.custom_fields.map((field, index) => <>
                    <div className='col-span-6'>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <label htmlFor="country" className="sr-only">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    autoComplete="country"
                                    onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
                                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option selected={field.type == 'text'} value={"text"}>Text</option>
                                    <option selected={field.type == 'date'} value={"date"}>Date</option>
                                    <option selected={field.type == 'number'} value={"number"}>Number</option>
                                </select>
                            </div>
                            <input
                                type={"text"}
                                id={"field" + index}
                                className="block w-full rounded-md border-gray-300 pl-24 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Name"
                                onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                                value={field.name}
                            />
                        </div>
                    </div>
                    <div className='col-span-5'>
                        <TextInput
                            id={"input" + index}
                            className="block w-full py-1.5 mt-0.5"
                            required
                            isFocused
                            type={field.type}
                            onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                            value={field.value}
                        />
                    </div>
                    <div onClick={() => handleCustomFieldRemove(index)} className='col-span-1 flex items-center justify-center'>
                        <TrashIcon className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                    </div>
                </>)}
                <div className='col-span-12'>
                    <PrimaryButton onClick={handleAddField}>Add Another Field</PrimaryButton>
                </div>
            </div>
            <div className="border-t mx-4 border-gray-200  px-4 py-5 sm:px-6">
                <PrimaryButton disabled={form.processing} className='!bg-indigo-600' onClick={handleSubmit}>{contact ? 'Update' : 'Create'}</PrimaryButton>
            </div>

        </div>
    )
}

export default ContactCreateForm