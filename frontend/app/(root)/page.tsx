import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";

const Home = async () => {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

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