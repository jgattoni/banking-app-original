import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import PlaidLink from "@/components/PlaidLink";
import { getUserInfo } from "@/lib/actions/user.actions";

const Home = async () => {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        redirect("/sign-in");
    }

    const databaseUser = await getUserInfo({ userId: clerkUser.id });

    const loggedInUser: User = {
        id: databaseUser.id,
        clerkId: databaseUser.clerk_id,
        firstName: databaseUser.first_name,
        lastName: databaseUser.last_name,
        email: databaseUser.email
    };

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                      type="greeting"
                      title="Welcome"
                      user={loggedInUser.firstName || 'Guest'}
                      subtext={"Access and manage your account and transactions efficiently."}
                    />
                    <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={1250.35}
                    />
                </header>
                <PlaidLink user={loggedInUser} variant="primary" />
                RECENT TRANSACTIONS
            </div>
            <RightSidebar
                user={loggedInUser}
                transactions={[]}
                banks={[{ currentBalance: 123.50},{currentBalance: 500.00}]}
            />
        </section>
    )
}

export default Home