import { Contact } from '@/types/Contact'
import { usePage } from '@inertiajs/react'
import ContactSelectBox from './ContactSelectBox'
import PrimaryButton from './PrimaryButton'
import { useEffect, useState } from 'react'

type Props = {
    primaryContact: [Contact, CallableFunction],
    secondaryContact: [Contact, CallableFunction],
    onMerge: CallableFunction
}
const notificationMethods = [
    { id: 'email', title: 'Email' },
    { id: 'sms', title: 'Phone (SMS)' },
    { id: 'push', title: 'Push notification' },
]

const MergeContactForm = ({ primaryContact: primaryContactState, secondaryContact: secondaryContactState, onMerge: dispatchMerge }: Props) => {
    const contacts = usePage()?.props?.contacts as Contact[];
    const [primaryContact, setPrimaryContact] = primaryContactState;
    const [secondaryContact, setSecondaryContact] = secondaryContactState;
    const [conflictingFields, setConflictingFields] = useState([]);

    const handleSubmit = () => {
        const selectedFields = conflictingFields
            .map(fields => fields.find(field => field.selected))
            .filter(Boolean);

        // console.log("User Preferred Fields:", selectedFields);
        dispatchMerge(selectedFields);
    };


    useEffect(() => {
        if (!primaryContact || !secondaryContact) return;

        const primaryFields = primaryContact.custom_fields;
        const secondaryFields = secondaryContact.custom_fields;

        const conflicts = primaryFields
            .map(primaryField => {
                const secondaryField = secondaryFields.find(
                    secField => secField.name === primaryField.name && secField.value !== primaryField.value
                );

                return secondaryField ? [
                    { ...primaryField, selected: false },
                    { ...secondaryField, selected: false },
                    { id: 1234, name: 'Both', value: "Keep Both", selected: false }
                ] : null;
            })
            .filter(Boolean); // Remove null values

        setConflictingFields(conflicts);
    }, [primaryContact, secondaryContact]);

    const handleSelection = (conflictIndex, selectedFieldId) => {
        setConflictingFields(prevConflicts =>
            prevConflicts.map((fields, index) =>
                index === conflictIndex
                    ? fields.map(field => ({ ...field, selected: field.id === selectedFieldId }))
                    : fields
            )
        );
    };

    return (
        <>
            <div className='min-h-72 -z-10'>
                <div className='p-6 border-b border-gray-200 text-lg font-semibold'>
                    Merge Contacts
                </div>
                <div className='p-6'>
                    <div className=''>
                        <ContactSelectBox
                            label='Select Contact (Primary)'
                            contacts={contacts}
                            handleSelected={(contact: Contact) => setPrimaryContact(contact)}
                            selected={primaryContact}
                        />
                    </div>
                    <div className='mt-4'>
                        <ContactSelectBox
                            label='Select Contact to Merge with (Secondary)'
                            contacts={contacts}
                            handleSelected={(contact: Contact) => setSecondaryContact(contact)}
                            selected={secondaryContact}
                        />
                    </div>
                    {conflictingFields.length > 0 && <div className='mt-4'>
                        <h2>Conflicts:</h2>
                        <p className="text-sm leading-5 text-gray-500 mb-4">Please resolve the conflicting fields below:</p>
                        {conflictingFields.map((fields, index) => (
                            <div key={index} className='mb-4'>
                                <label className="text-base font-medium text-gray-900">
                                    Choose a value for <b>{fields[0].name}</b>
                                </label>
                                <fieldset className="mt-4">
                                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                        {fields.map((field) => (
                                            <div key={field.id} className="flex items-center">
                                                <input
                                                    id={field.id}
                                                    name={`conflict-${index}`} // Group radio buttons per conflict
                                                    type="radio"
                                                    checked={field.selected} // Bind to selected state
                                                    onChange={() => handleSelection(index, field.id)} // Update selection
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label htmlFor={field.id} className="ml-3 block text-sm font-medium text-gray-700">
                                                    {field.value}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>
                        ))}
                    </div>}

                </div>
                <div className='p-6 border-t border-gray-200 mt-4'>
                    <PrimaryButton onClick={handleSubmit} disabled={primaryContact.id === secondaryContact.id}>Merge Contacts</PrimaryButton>
                </div>
            </div>
        </>
    )
}

export default MergeContactForm