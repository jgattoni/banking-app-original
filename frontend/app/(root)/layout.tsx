import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getUserInfo } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { UserProvider } from "@/components/UserProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        redirect("/sign-in");
    }

    const databaseUser = await getUserInfo({ userId: clerkUser.id });

    const loggedInUser: User = {
        id: databaseUser.id, // This is the Supabase ID
        clerkId: databaseUser.clerk_id,
        firstName: databaseUser.first_name,
        lastName: databaseUser.last_name,
        email: databaseUser.email
    };

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
        <UserProvider user={loggedInUser}>
            {children}
        </UserProvider>
        </div>
    </main>
  );
}

