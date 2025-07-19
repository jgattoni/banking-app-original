import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const MyBanks = () => {
    return (
        <section className="flex size-full flex-col">
            <div className="my-banks-header">
                <h1 className="header-2">My Banks</h1>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <Link href="/my-banks/connect">
                    <Button className="primary-button">
                        Connect to my bank using Plaid
                    </Button>
                </Link>
                {/* Add other bank connection options here */}
            </div>
        </section>
    )
}
export default MyBanks