import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import ListAccounts from '../../components/ListAccounts';

const MyBanks = () => {
    return (
        <section className="flex size-full flex-col">
            <div className="my-banks-header">
                <h1 className="text-[18px] leading-[22px] font-semibold text-gray-900">My Banks</h1>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <Link to="/my-banks/connect">
                    <Button variant="default">
                        Connect a New Bank with Plaid
                    </Button>
                </Link>
                <ListAccounts />
            </div>
        </section>
    )
}
export default MyBanks
