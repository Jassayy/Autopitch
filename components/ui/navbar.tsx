import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
     return (
          <div className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-sm border-b border-neutral-200 dark:bg-black/80 dark:border-neutral-800 z-50">
               <div className="container mx-auto h-full flex items-center px-4 lg:px-24 justify-between">
                    <Link href="/">
                         <Image
                              src="/logo.svg"
                              alt="AutoPitch Logo"
                              width={180}
                              height={40}
                              className="h-8 w-auto"
                         />
                    </Link>
                    <div className="flex items-center gap-4">
                         <SignedOut>
                              <Link href="sign-in">
                                   <Button variant="outline">Sign in</Button>
                              </Link>
                              <Link href="sign-up">
                                   <Button>Sign up</Button>
                              </Link>
                         </SignedOut>
                         <SignedIn>
                              <UserButton />
                         </SignedIn>
                    </div>
               </div>
          </div>
     );
};

export default Navbar;
