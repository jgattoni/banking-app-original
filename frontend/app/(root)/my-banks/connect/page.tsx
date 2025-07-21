"use client";

import PlaidLink from "@/components/PlaidLink";
import { useUser } from "@/components/UserProvider";

const ConnectBank = () => {
    const loggedInUser = useUser();

    if (!loggedInUser) {
        return <div>Loading user data...</div>; // Or a more sophisticated loader
    }

    return (
        <section className="flex size-full flex-col items-center p-4">
            <h2 className="text-2xl font-bold mb-4">Connect Your Bank Account with Plaid</h2>
            <div className="mb-8">
                <PlaidLink user={loggedInUser} variant="primary" />
            </div>
        </section>
    )
}

export default ConnectBank;