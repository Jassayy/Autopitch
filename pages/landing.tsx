import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Landing = () => {
     return (
          <>
               <Navbar />
               <div className="relative min-h-screen w-full bg-white dark:bg-black">
                    <div
                         className={cn(
                              "absolute inset-0",
                              "[background-size:40px_40px]",
                              "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                              "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                         )}
                    />
                    {/* Radial gradient for the container to give a faded look */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

                    {/* Hero Section */}
                    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16">
                         <div className="relative z-20 flex flex-col items-center gap-8 text-center px-4 max-w-4xl mx-auto">
                              <h1 className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-4xl font-bold text-transparent sm:text-9xl">
                                   AutoPitch
                              </h1>
                              <p className="max-w-2xl text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-400">
                                   Generate hyper-personalized cold emails in
                                   seconds—powered by AI. Stop wasting hours on
                                   templates that get ignored. AutoPitch
                                   analyzes your prospect's role, company, and
                                   pain points to craft messages that actually
                                   get replies. Try it free (no credit card
                                   needed).
                              </p>
                              <div className="flex gap-4 mt-4">
                                   <Link href="/">
                                        <Button variant="outline" size="lg">
                                             Guide
                                        </Button>
                                   </Link>
                                   <Link href="sign-up">
                                        <Button size="lg">Get started</Button>
                                   </Link>
                              </div>
                         </div>
                    </div>

                    {/* Pricing Plans */}
                    <div className="w-full max-w-7xl mx-auto px-4 py-24">
                         <div className="text-center mb-16">
                              <h2 className="text-3xl font-bold mb-4">
                                   Simple, Transparent Pricing
                              </h2>
                              <p className="text-neutral-600 dark:text-neutral-400">
                                   Choose the plan that's right for you
                              </p>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                              {/* Free Tier */}
                              <div className="relative flex flex-col p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                                   <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-2">
                                             Free
                                        </h3>
                                        <div className="flex items-baseline">
                                             <span className="text-4xl font-bold">
                                                  $0
                                             </span>
                                             <span className="text-neutral-600 dark:text-neutral-400 ml-2">
                                                  /month
                                             </span>
                                        </div>
                                   </div>
                                   <ul className="space-y-4 mb-8 flex-grow">
                                        <li className="flex items-center">
                                             <svg
                                                  className="w-5 h-5 text-green-500 mr-2"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M5 13l4 4L19 7"
                                                  />
                                             </svg>
                                             <span>5 emails per month</span>
                                        </li>
                                        <li className="flex items-center">
                                             <svg
                                                  className="w-5 h-5 text-green-500 mr-2"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M5 13l4 4L19 7"
                                                  />
                                             </svg>
                                             <span>Basic email templates</span>
                                        </li>
                                        <li className="flex items-center">
                                             <svg
                                                  className="w-5 h-5 text-green-500 mr-2"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M5 13l4 4L19 7"
                                                  />
                                             </svg>
                                             <span>
                                                  Standard AI personalization
                                             </span>
                                        </li>
                                   </ul>
                                   <Link href="/sign-up">
                                        <Button
                                             variant="outline"
                                             className="w-full"
                                        >
                                             Get Started
                                        </Button>
                                   </Link>
                              </div>

                              {/* Pro Tier */}
                              <div className="relative flex flex-col p-8 bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-900 dark:border-neutral-100 shadow-lg scale-105">
                                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium px-4 py-1 rounded-full">
                                             Most Popular
                                        </span>
                                   </div>
                                   <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-2">
                                             Pro
                                        </h3>
                                        <div className="flex items-baseline">
                                             <span className="text-4xl font-bold">
                                                  $19.99
                                             </span>
                                             <span className="text-neutral-600 dark:text-neutral-400 ml-2">
                                                  /month
                                             </span>
                                        </div>
                                   </div>
                                   <ul className="space-y-4 mb-8 flex-grow">
                                        <li className="flex items-center">
                                             <svg
                                                  className="w-5 h-5 text-green-500 mr-2"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M5 13l4 4L19 7"
                                                  />
                                             </svg>
                                             <span>Unlimited emails</span>
                                        </li>
                                        <li className="flex items-center">
                                             <svg
                                                  className="w-5 h-5 text-green-500 mr-2"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M5 13l4 4L19 7"
                                                  />
                                             </svg>
                                             <span>
                                                  Custom prompt generation
                                             </span>
                                        </li>
                                        <li className="flex items-center">
                                             <svg
                                                  className="w-5 h-5 text-green-500 mr-2"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M5 13l4 4L19 7"
                                                  />
                                             </svg>
                                             <span>
                                                  Advanced AI personalization
                                             </span>
                                        </li>
                                        <li className="flex items-center">
                                             <svg
                                                  className="w-5 h-5 text-green-500 mr-2"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M5 13l4 4L19 7"
                                                  />
                                             </svg>
                                             <span>Priority support</span>
                                        </li>
                                   </ul>
                                   <Link href="/sign-up">
                                        <Button className="w-full">
                                             Get Started
                                        </Button>
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>
               <Footer />
          </>
     );
};

export default Landing;
