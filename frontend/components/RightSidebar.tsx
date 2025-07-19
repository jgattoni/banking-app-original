"use client";

import Link from "next/link";
import Image from "next/image";
import BankCard from "@/components/BankCard";
import {
  UserButton,
} from '@clerk/nextjs'
import { useUser } from "@/components/UserProvider";

const RightSidebar = ({transactions, banks}:
RightSidebarProps) => {
    const loggedInUser = useUser();

    return (
        <aside className={"right-sidebar"}>
            <section className={"flex flex-col pb-8"}>
                <div className={"profile-banner"}/>
                <div className={"profile"}>
                    <div className={"profile-img"}>
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: {
                                    width: "72px",
                                    height: "72px"
                                }
                            },
                          }}/>
                    </div>
                    <div className={"profile-details"}>
                        <h1 className={"profile-name"}>{loggedInUser?.firstName} {loggedInUser?.lastName}</h1>
                        <p className={"profile-email"}>{loggedInUser?.email}</p>
                    </div>
                </div>
            </section>
            <section className={"banks"}>
                <div className={"flex w-full justify-between"}>
                    <h2 className={"header-2"}>My Banks</h2>
                    <Link href={"/"} className={"flex gap-2"}>
                        <Image
                            src={"icons/plus.svg"}
                            width={20}
                            height={20}
                            alt={"plus"}
                        />
                        <h2 className={"text-14 font-semibold text-gray-600"}>Add Bank</h2>
                    </Link>
                </div>
                {banks?.length > 0 &&
                    <div className={"relative flex flex-1 flex-col items-center justify-center gap-5"}>
                        <div className={"relative z-10"}>
                             <BankCard
                                 key={banks[0].id}
                                 account={banks[0]}
                                 userName={`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
                                 showBalance={false}
                             />
                        </div>
                        {banks[1] && (
                            <div className={"absolute right-0 top-8 z-0 w-[90%]"}>
                                <BankCard
                                     key={banks[1].id}
                                     account={banks[1]}
                                     userName={`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
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