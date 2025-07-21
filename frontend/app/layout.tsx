import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({ 
  subsets: ["latin"], 
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
 });

export const metadata: Metadata = {
  title: "Shoreview",
  description: "Shoreview is a moderne banking platform for everyone",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="en">
        <body className={`${inter.variable} ${ibmPlexSerif.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
