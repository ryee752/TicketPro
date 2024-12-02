"use client"
import { lusitana } from '../ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  PhoneIcon,
  HomeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function UserOrOrganization() {
  const router = useRouter();
  const handleCustomer = () =>{
    router.push('/login/customer');
  }

  const handleOrg = () =>{
    router.push('/login/organization');
  }
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <h1 className={`${lusitana.className} mb-3 text-2xl`}>
        Select one of the following options.
      </h1>
      <div className="w-full">
        <div>
          <Button className="mt-4 w-full" onClick={handleCustomer}>
            Customer <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
        <div>
          <Button type="submit" className="mt-4 w-full" onClick={handleOrg}>
            Organization <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
      </div>
    </div>
  )
}
