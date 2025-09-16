import { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import profile from "@/public/profile.png"

export default function LoginLayout({children}:{children:ReactNode}){
    return(
        <div className="relative flex min-h-svh flex-col items-center justify-center">
        <Link href="/" className={buttonVariants(
            {variant: 'outline',
            className:"absolute top-4 left-4",
            }
        )}>
            <ArrowLeft className="size-4"/>
            Back
             </Link> 
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link className="flex items-center gap-2 self-center font-medium" href="/">
             <Image src={profile} alt="Logo" className="size-8"/>
             SPARC LMS
            </Link>
            {children}
            <div className="text-balance text-center text-xs text-muted-foreground">
             By clicking continue, you agree to our <span className="hover:text-primary hover:underline"> Terms of service</span>
             {" "}
             and <span className="hover:text-primary hover:underline">Privacy policy</span>  
            </div>
        </div>
        </div>
    )

}