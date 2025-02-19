import { router, usePage } from "@inertiajs/react";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";



export default function ContactList({ contacts, onEdit }) {
    const { props: { filters: { search, gender } } } = usePage();

    const handleEdit = (e, contact) => {
        e.preventDefault();
        onEdit(contact);
    }

    const handleFilter = (data) => {
        router.reload({
            data: data
        });
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex ">
                <div className="mr-2">
                    <InputLabel htmlFor="phone" value="Search" />
                    <TextInput onBlur={(e) => handleFilter({ search: e.target.value == '' ? undefined : e.target.value, gender: gender ?? undefined })} defaultValue={search} placeholder="Search..." className="mt-1 p-1.5" />
                </div>
                <div>
                    <InputLabel htmlFor="phone" value="Gender" />
                    <select onChange={(e) => handleFilter({ search: search ?? undefined, gender: e.target.value == 'ALL' ? undefined : e.target.value })} id="phone" name="phone" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value={"ALL"} selected={gender == 'ALL'}>All</option>
                        <option value={"MALE"} selected={gender == 'MALE'} >Male</option>
                        <option value={"FEMALE"} selected={gender == 'FEMALE'}>Female</option>
                    </select>
                </div>

            </div>
            <div className="  flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Info
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Added at
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-full" src={contact?.profile_photo} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{contact.name}</div>
                                                        <div className="text-gray-500">{contact.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div className="text-gray-900">{contact.phone}</div>
                                                <div className="text-gray-500">{contact.gender}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(contact.created_at).toLocaleString()}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <a href="#" onClick={(e) => handleEdit(e, contact)} className="text-indigo-600 hover:text-indigo-900">
                                                    Edit<span className="sr-only">, {contact.name}</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
