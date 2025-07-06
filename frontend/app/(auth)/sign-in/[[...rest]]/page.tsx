"use client";
import {SignedOut, SignUp} from '@clerk/nextjs'
 
export default function Page() {
  return (
      <div className={"min-h-screen flex items-center justify-center ml-5 mr-5"}>
        <SignedOut><SignUp /></SignedOut>
      </div>

  );
}