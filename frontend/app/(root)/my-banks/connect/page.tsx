"use client";

import PlaidLink from "@/components/PlaidLink";
import { useUser } from "@/components/UserProvider";

const ConnectBank = () => {
    const loggedInUser = useUser();

    if (!loggedInUser) {
        return <div>Loading user data...</div>; // Or redirect to sign-in
    }

    return (
        <section className="flex size-full justify-center items-center">
            <PlaidLink user={loggedInUser} variant="primary" />
        </section>
    )
}

export default ConnectBank;