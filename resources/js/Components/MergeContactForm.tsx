import { Contact } from '@/types/Contact'
import { usePage } from '@inertiajs/react'
import ContactSelectBox from './ContactSelectBox'
import PrimaryButton from './PrimaryButton'
import { useEffect } from 'react'

type Props = {
    primaryContact: [Contact, CallableFunction],
    secondaryContact: [Contact, CallableFunction],
    onMerge: CallableFunction
}

const MergeContactForm = ({ primaryContact: primaryContactState, secondaryContact: secondaryContactState, onMerge: dispatchMerge }: Props) => {
    const contacts = usePage()?.props?.contacts as Contact[];
    const [primaryContact, setPrimaryContact] = primaryContactState;
    const [secondaryContact, setSecondaryContact] = secondaryContactState;

    const handleSubmit = () => {
        dispatchMerge();
    }

    useEffect(() => {
        // get confilcting fields
        console.log(primaryContact.custom_fields, secondaryContact.custom_fields)
    }, [primaryContact, secondaryContact])

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
                </div>
                <div className='p-6 border-t border-gray-200 mt-4'>
                    <PrimaryButton onClick={handleSubmit} disabled={primaryContact.id === secondaryContact.id}>Merge Contacts</PrimaryButton>
                </div>
            </div>
        </>
    )
}

export default MergeContactForm