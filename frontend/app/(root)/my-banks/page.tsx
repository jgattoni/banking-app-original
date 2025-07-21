import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ListAccounts from '@/components/ListAccounts'; // Import the new component

const MyBanks = () => {
    return (
        <section className="flex size-full flex-col">
            <div className="my-banks-header">
                <h1 className="header-2">My Banks</h1>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <Link href="/my-banks/connect">
                    <Button className="plaidlink-primary">
                        Connect a New Bank with Plaid
                    </Button>
                </Link>
                <ListAccounts /> {/* Add the new component here */}
            </div>
        </section>
    )
}
export default MyBanks