import React, { useState } from 'react'
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ContactCreateForm from '@/Components/ContactCreateForm';
import ContactList from '@/Components/ContactList';

export default function Dashboard({ contacts }: { contacts: [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editableContact, setEditableContact] = useState(null);
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Contacts
                    </h2>
                    <PrimaryButton onClick={() => {
                        setShowModal(true);
                        setEditableContact(null);
                    }}>Create Contact</PrimaryButton>
                </div>
            }
        >
            <Head title="Contacts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl ">
                    <ContactList contacts={contacts} onEdit={(contact) => {
                        console.log('Edit clicked', contact);
                        setShowModal(true);
                        setEditableContact(contact);
                    }} />
                    <Modal show={showModal} onClose={setShowModal} maxWidth="2xl" >
                        <ContactCreateForm editableContact={editableContact} onClose={() => {
                            setShowModal(false);
                            setEditableContact(null);
                        }} />
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
