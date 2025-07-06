import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar />
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image
                src={"icons/logo.svg"}
                width="30"
                height="30"
                alt={"logo"}
            />
              <div className={"flex items-center gap-3"}>
                  <UserButton />
                  <MobileNav  />
              </div>
          </div>
        {children}
        </div>
    </main>
  );
}

