import React, { useState } from 'react'
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import ContactCreateForm from '@/Components/ContactCreateForm';
import ContactList from '@/Components/ContactList';
import SecondaryButton from '@/Components/SecondaryButton';
import MergeContactForm from '@/Components/MergeContactForm';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Contact } from '@/types/Contact';

export default function Dashboard({ contacts }: { contacts: Contact[] }) {
    const [showModal, setShowModal] = useState(false);
    const [showMergeModal, setShowMergeModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [preferred_fields, setPreferredFields] = useState([]);

    const [editableContact, setEditableContact] = useState(null);

    const [primaryContact, setPrimaryContact] = useState<Contact>(contacts[0]);
    const [secondaryContact, setSecondaryContact] = useState<Contact>(contacts[1]);




    const handleMerge = () => {
        setShowConfirmationModal(false);
        setShowMergeModal(false);

        router.post(route('contacts.merge'), {
            primary_contact: primaryContact.id,
            secondary_contact: secondaryContact.id,
            preferred_fields: preferred_fields
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Contacts
                    </h2>
                    <div className="flex space-x-4">
                        {contacts.length >= 2 && <SecondaryButton onClick={() => {
                            setShowMergeModal(true);
                        }} >Merge Contacts</SecondaryButton>}
                        <PrimaryButton onClick={() => {
                            setShowModal(true);
                            setEditableContact(null);
                        }}>Create Contact</PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title="Contacts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl ">
                    <ContactList contacts={contacts} onEdit={(contact) => {
                        setShowModal(true);
                        setEditableContact(contact);
                    }} />
                    <Modal show={showModal} onClose={setShowModal} maxWidth="2xl" >
                        <ContactCreateForm editableContact={editableContact} onClose={() => {
                            setShowModal(false);
                            setEditableContact(null);
                        }} />
                    </Modal>
                    <Modal show={showMergeModal} onClose={setShowMergeModal} maxWidth="2xl" >
                        <MergeContactForm
                            onMerge={(preferred_fields) => {
                                setPreferredFields(preferred_fields);
                                setShowConfirmationModal(true);
                            }}
                            primaryContact={[primaryContact, setPrimaryContact]}
                            secondaryContact={[secondaryContact, setSecondaryContact]}
                        />
                    </Modal>
                    <ConfirmationModal
                        open={showConfirmationModal}
                        setOpen={setShowConfirmationModal}
                        onConfirm={() => {
                            console.log('Merging contacts...');
                            handleMerge();
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
