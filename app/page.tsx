import { SidebarDemo } from "@/pages/dashboard";
import HomePage from "@/pages/homepage";
import Landing from "@/pages/landing";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
     return (
          <>
               <SignedOut>
                    <Landing />
               </SignedOut>
               <SignedIn>
                    <HomePage />
               </SignedIn>
          </>
     );
}
