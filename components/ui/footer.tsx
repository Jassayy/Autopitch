import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
     return (
          <footer className="border-t dark:border-neutral-800 bg-white dark:bg-black">
               <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                         <Link href="/">
                              <Image
                                   src="/logo.svg"
                                   alt="AutoPitch Logo"
                                   width={180}
                                   height={40}
                                   className="h-8 w-auto"
                              />
                         </Link>
                         <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              © {new Date().getFullYear()} AutoPitch. All rights
                              reserved.
                         </p>
                    </div>
               </div>
          </footer>
     );
};

export default Footer;
