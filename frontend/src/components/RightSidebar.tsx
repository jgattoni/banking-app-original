import { Link } from "react-router-dom";
import BankCard from "./BankCard";
import { UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

const RightSidebar = ({ transactions, banks }: RightSidebarProps) => {
    const { user } = useUser();

    return (
        <aside className={"h-screen max-h-screen flex-col border-l border-gray-200 hidden xl:flex w-[355px] xl:overflow-y-auto"}>
            <section className={"flex flex-col pb-8"}>
                <div className={"h-[120px] w-full bg-gradient-mesh bg-cover bg-no-repeat"} />
                <div className={"relative flex px-6 max-xl:justify-center"}>
                    <div className={"absolute -top-8 rounded-full size-24 bg-gray-100 border-8 border-white p-2 shadow-profile flex-center"}>
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: {
                                    width: "72px",
                                    height: "72px"
                                }
                            },
                        }} />
                    </div>
                    <div className={"flex flex-col pt-24"}>
                        <h1 className={"text-lg font-semibold text-gray-900"}>{user?.firstName} {user?.lastName}</h1>
                        <p className={"text-sm font-normal text-gray-600"}>{user?.emailAddresses[0].emailAddress}</p>
                    </div>
                </div>
            </section>
            <section className={"flex flex-col justify-between gap-8 px-6 py-8"}>
                <div className={"flex w-full justify-between"}>
                    <h2 className={"text-xl font-bold text-gray-900"}>My Banks</h2>
                    <Link to={"/"} className={"flex gap-2"}>
                        <img
                            src={"/icons/plus.svg"}
                            width={20}
                            height={20}
                            alt={"plus"}
                        />
                        <h2 className={"text-sm font-semibold text-gray-600"}>Add Bank</h2>
                    </Link>
                </div>
                {banks?.length > 0 &&
                    <div className={"relative flex flex-1 flex-col items-center justify-center gap-5"}>
                        <div className={"relative z-10"}>
                            <BankCard
                                key={banks[0].id}
                                account={banks[0]}
                                userName={`${user?.firstName} ${user?.lastName}`}
                                showBalance={false}
                            />
                        </div>
                        {banks[1] && (
                            <div className={"absolute right-0 top-8 z-0 w-[90%]"}>
                                <BankCard
                                    key={banks[1].id}
                                    account={banks[1]}
                                    userName={`${user?.firstName} ${user?.lastName}`}
                                    showBalance={false}
                                />
                            </div>
                        )}
                    </div>
                }
            </section>
        </aside>
    )
}

export default RightSidebar