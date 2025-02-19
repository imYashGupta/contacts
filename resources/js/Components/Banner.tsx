/* This example requires Tailwind CSS v2.0+ */
import { MegaphoneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { router, usePage } from '@inertiajs/react'

export default function Banner() {
    const flash = usePage().props?.flash;
    const message = flash?.message;
    const type = flash?.type;
    const typeClass = type === 'success' ? 'indigo' : 'red';

    return (
        <div className={`bg-${typeClass}-600`}>
            <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex w-0 flex-1 items-center">
                        <span className={`flex rounded-lg bg-${typeClass}-800 p-2`}>
                            <InformationCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                        <p className="ml-3 truncate font-medium text-white">
                            <span className="md:hidden">{message}</span>
                            <span className="hidden md:inline">{message}</span>
                        </p>
                    </div>
                    <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                        <button
                            onClick={() => router.reload()}
                            type="button"
                            className={`-mr-1 flex rounded-md p-2 hover:bg-${typeClass}-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2`}
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
