"use client"
import Link from "next/link";
import Image from "next/image"
import {sidebarLinks} from "@/constants";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import { UserButton, SignInButton, SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <section className={"sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4 xl:p-6 2xl:w-[355px]"}>
            <nav className={"flex flex-col gap-4"}>
                <Link href="/" className={"flex mb-12 cursor-pointer items-center gap-2"}>
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Horizon Logo"
                        className={"size-[24px] max-xl:size-14"}
                    />
                    <h1 className={"text-2xl font-ibm-plex-serif font-bold text-black-1 max-xl:hidden"}>Horizon</h1>
                </Link>
                <div className={"flex-center hidden md:flex"}>
                    <UserButton />
                </div>
                {sidebarLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith('$(item.route)/');
                    return (
                        <Link href={item.route} key={item.label}
                        className={cn('flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start', {'bg-bank-gradient':isActive})}>
                            <div className={"relative size-6"}>
                                <Image
                                    src={item.imgURL}
                                    alt={item.label}
                                    fill
                                    className={cn({'brightness-[3] invert-0':isActive})}
                                />
                            </div>
                            <p className={cn('text-base font-semibold text-black-2 max-xl:hidden', { '!text-white':isActive })}>
                                {item.label}
                            </p>
                        </Link>
                    )
                })}
            </nav>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </section>
        )
}

export default Sidebar