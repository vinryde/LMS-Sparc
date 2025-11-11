"use client";
import Image from "next/image";
import Link from "next/link";
import profile from "@/public/profile.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import UserDropdown from "@/app/(auth)/login/_components/UserDropdown";
const navItems=[ 
    {
        name:'Home', href: '/'
    },
    {name:'Courses',href: '/courses'},
    {name:'Dashboard',href: '/dashboard'},
]

export function Navbar(){
    const {data: session, isPending}= authClient.useSession();
    return(
    <header className="sticky top-0 z-50 w-full border-b bg-white/10 backdrop-blur-2xl">
        <div className="container flex  min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
            <Link href="/" className="flex items-center space-x-2 mr-4">
            <span className="font-bold">CREATE.</span>
            </Link>
            <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                <div className="flex items-center space-x-4" >
                    {navItems.map((item)=>(
                        <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                            {item.name}
                        </Link>
                    )

                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeToggle/>
                    {isPending ? null: session?(
                        <UserDropdown email={session.user.email} image={session?.user.image??`https://avatar.vercel.sh/${session?.user.email}`} name={session?.user.name && session.user.name.length>0 ? session.user.name : session?.user.email.split("@")[0]} />
                    ):(
                        <>
                        <Link href="/login" className={buttonVariants({
                            variant : "outline"
                        })}>
                             Login
                        
                        </Link>
                        <Link href="/login" className={buttonVariants({
                            variant : "secondary"
                        })}>
                             Get Started
                        
                        </Link>
                        </>
                    )} 

                </div>
            </nav>

        </div>
    </header>
);}