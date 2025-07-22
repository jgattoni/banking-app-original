import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "../constants";
import { cn } from "../lib/utils";
import { UserButton, SignInButton, SignedOut } from "@clerk/clerk-react";

const Sidebar = () => {
    const location = useLocation();

    return (
        <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r bg-white pt-8 hidden md:flex sm:p-4 xl:p-6 2xl:w-[355px]">
            <nav className="flex flex-col gap-4">
                <Link to="/dashboard" className="flex mb-12 items-center gap-2">
                    <img
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Horizon Logo"
                        className="size-[24px]"
                    />
                    <h1 className="text-2xl font-bold text-black hidden xl:block">Horizon</h1>
                </Link>
                <div className="hidden md:flex justify-center">
                    <UserButton />
                </div>
                {sidebarLinks.map((item) => {
                    const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
                    return (
                        <Link
                            to={item.route}
                            key={item.label}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg justify-center xl:justify-start",
                                isActive ? "bg-bank-gradient text-black" : "text-black"
                            )}
                        >
                            <img
                                src={item.imgURL}
                                alt={item.label}
                                className="w-6 h-6"
                            />
                            <p className="text-base font-semibold hidden xl:block">{item.label}</p>
                        </Link>
                    );
                })}
            </nav>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </section>
    );
};

export default Sidebar;