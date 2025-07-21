import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ListAccounts from '@/components/ListAccounts'; // Import the new component

const MyBanks = () => {
    return (
        <section className="flex size-full flex-col">
            <div className="my-banks-header">
                <h1 className="text-[18px] leading-[22px] font-semibold text-gray-900">My Banks</h1>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <Link href="/my-banks/connect">
                    <Button variant="default">
                        Connect a New Bank with Plaid
                    </Button>
                </Link>
                <ListAccounts /> {/* Add the new component here */}
            </div>
        </section>
    )
}
export default MyBanks