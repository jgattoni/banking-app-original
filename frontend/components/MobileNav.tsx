"use client"

import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
import Link from "next/link";
import {sidebarLinks} from "@/constants";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const MobileNav = () => {
    const pathname = usePathname();

    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <Image
                      src="/icons/hamburger.svg"
                      width={30}
                      height={30}
                      alt="menu"
                      className="cursor-pointer"
                    />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white">
                    <Link href="/" className={"cursor-pointer flex items-center gap-1 px-4 py-2"}>
                        <Image
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="Horizon Logo"
                        />
                        <h1 className={"text-xl font-ibm-flex-serif font-bold text-black-1"}>Horizon</h1>
                    </Link>
                    <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-16 text-white px-4">
                                {sidebarLinks.map((item) => {
                                    const isActive = pathname === item.route || pathname.startsWith('$(item.route)/');
                                    return (
                                        <SheetClose asChild key={item.route}>
                                            <Link href={item.route} key={item.label}
                                                className={cn('flex gap-3 items-center p-4 rounded-lg w-full max-w-60', {'bg-bank-gradient':isActive})}>
                                                    <Image
                                                        src={item.imgURL}
                                                        alt={item.label}
                                                        width={20}
                                                        height={20}
                                                        className={cn({'brightness-[3] invert-0':isActive})}
                                                    />
                                                    <p className={cn('text-base font-semibold text-black-2', { 'text-white':isActive })}>
                                                        {item.label}
                                                    </p>
                                            </Link>
                                        </SheetClose>
                                    )
                                })}
                                USER
                            </nav>
                        </SheetClose>
                        FOOTER
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav;