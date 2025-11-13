'use client'
import { ReactNode } from "react";
import { Navbar } from "@/components/ui/navbar";
import { usePathname } from "next/navigation";

export default function LayoutPublic({children}:{children:ReactNode}){
    const pathname = usePathname();
    const nopadding= pathname === "/"
    
    return (
        <div>
            <Navbar/>

            <main className={`container mx-auto ${nopadding ? "px-0" : "xs:px-6 md:px-6 lg:px-8"} mb-32`}>{children}</main>

        </div>
        )
}