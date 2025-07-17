import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import { usePlaidLink } from 'react-plaid-link';
import { useEffect, useState } from 'react';
import { createLinkToken } from '../../lib/plaid';

const Home = async () => {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const [linkToken, setLinkToken] = useState<string | null>(null);

    useEffect(() => {
        const getLinkToken = async () => {
            if (user?.id) {
                const token = await createLinkToken(user.id);
                setLinkToken(token);
            }
        };
        getLinkToken();
    }, [user]);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
            try {
                const accessToken = await exchangePublicToken(public_token);
                console.log('Access Token:', accessToken);

                const accounts = await getAccounts(accessToken);
                console.log('Accounts:', accounts);

                const transactions = await getTransactions(accessToken);
                console.log('Transactions:', transactions);
            } catch (error) {
                console.error('Error in Plaid Link onSuccess:', error);
            }
        },
        onExit: (err, metadata) => {
            console.error('Plaid Link exited:', err, metadata);
        },
    });

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                      type="greeting"
                      title="Welcome"
                      user={user.firstName || 'Guest'}
                      subtext={"Access and manage your account and transactions efficiently."}
                    />
                    <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={1250.35}
                    />
                </header>
                <button onClick={() => open()} disabled={!ready}>
                    Connect Bank
                </button>
                RECENT TRANSACTIONS
            </div>
            <RightSidebar
                user={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.emailAddresses?.[0]?.emailAddress || "",
                }}
                transactions={[]}
                banks={[{ currentBalance: 123.50},{currentBalance: 500.00}]}
            />
        </section>
    )
}

export default Home