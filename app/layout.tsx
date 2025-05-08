import { Lusitana } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarDemo } from "@/pages/dashboard";
import { Toaster } from "sonner";

const lusitana = Lusitana({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
     title: "AutoPitch",
     description: "Generate hyper-personalized cold emails in seconds",
};

export default function RootLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <ClerkProvider>
               <html lang="en" className="dark">
                    <body className={`${lusitana.className} `}>
                         <Sidebar>
                              {children}
                              <SignedIn>
                                   <SidebarDemo />
                              </SignedIn>
                         </Sidebar>
                         <Toaster />
                    </body>
               </html>
          </ClerkProvider>
     );
}
