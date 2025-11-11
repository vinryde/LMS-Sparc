import { ReactNode } from "react";
import { Navbar } from "@/components/ui/navbar";

export default function LayoutPublic({children}:{children:ReactNode}){
    return (
        <div>
            <Navbar/>
            <main className="container mx-auto sm:px-3 md:px-6 lg:px-8 mb-32">{children}</main>

        </div>
        )
}