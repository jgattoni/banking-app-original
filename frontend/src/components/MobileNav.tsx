import {
    Sheet, SheetClose,
    SheetContent,
    SheetTrigger,
} from "./ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "../constants";
import { cn } from "../lib/utils";

const MobileNav = () => {
    const location = useLocation();

    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <img
                        src="/icons/hamburger.svg"
                        width={30}
                        height={30}
                        alt="menu"
                        className="cursor-pointer"
                    />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white">
                    <Link to="/dashboard" className="cursor-pointer flex items-center gap-1 px-4 py-2">
                        <img
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="Horizon Logo"
                        />
                        <h1 className="text-xl font-ibm-flex-serif font-bold text-black-1">Horizon</h1>
                    </Link>
                    <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                        <nav className="flex h-full flex-col gap-6 pt-16 text-white px-4">
                            {sidebarLinks.map((item) => {
                                const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
                                return (
                                    <Link
                                        to={item.route}
                                        key={item.label}
                                        className={cn(
                                            "flex gap-3 items-center p-4 rounded-lg w-full max-w-60",
                                            isActive ? "bg-bank-gradient text-white" : "text-black"
                                        )}
                                    >
                                        <img
                                            src={item.imgURL}
                                            alt={item.label}
                                            width={20}
                                            height={20}
                                            className={cn({ "brightness-[3] invert-0": isActive })}
                                        />
                                        <p className="text-base font-semibold text-black-2">
                                            {item.label}
                                        </p>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    );
};

export default MobileNav;