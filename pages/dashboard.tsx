"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { IconBrandTabler, IconHistory, IconCrown } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import HomePage from "@/pages/homepage";
import { animate } from "motion";

export function SidebarDemo() {
     const pathname = usePathname();
     const links = [
          {
               label: "Dashboard",
               href: "/",
               icon: (
                    <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
               ),
          },
          {
               label: "History",
               href: "/history",
               icon: (
                    <IconHistory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
               ),
          },
          {
               label: "Upgrade Plans",
               href: "/upgrade",
               icon: (
                    <IconCrown className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
               ),
          },
     ];
     const [open, setOpen] = useState(false);
     return (
          <div className="flex h-screen">
               <div className="fixed left-0 top-0 h-screen">
                    <Sidebar open={open} setOpen={setOpen} animate={false}>
                         <SidebarBody className="flex h-full flex-col justify-between">
                              <div className="flex flex-col">
                                   <div className="h-16 flex items-center">
                                        <Logo />
                                   </div>
                                   <div
                                        className={clsx(
                                             "flex flex-col gap-2 px-2"
                                        )}
                                   >
                                        {links.map((link, idx) => (
                                             <SidebarLink
                                                  key={idx}
                                                  link={link}
                                                  className="transition-colors duration-200"
                                             />
                                        ))}
                                   </div>
                              </div>
                              <div className="h-16 flex items-center px-2">
                                   <UserButton afterSignOutUrl="/" />
                              </div>
                         </SidebarBody>
                    </Sidebar>
               </div>
          </div>
     );
}

export const Logo = () => {
     return (
          <Link
               href="/"
               className="relative z-20 flex items-center  w-full py-1 text-sm font-normal text-black"
          >
               <Image
                    src="/logo.svg"
                    alt="Logo image"
                    height={50}
                    width={150}
                    className="object-contain"
               />
          </Link>
     );
};

export const LogoIcon = () => {
     return (
          <Link
               href="/"
               className="relative z-20 flex items-center justify-center w-full py-1 text-sm font-normal text-black"
          >
               <Image
                    src="/logo.svg"
                    alt="Logo Image"
                    height={50}
                    width={50}
                    className="object-contain"
               />
          </Link>
     );
};
