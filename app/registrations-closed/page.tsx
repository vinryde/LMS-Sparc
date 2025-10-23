import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, CircleSlash2, } from "lucide-react";
import Link from "next/link";

export default function RegistrationsClosed(){
    return(
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                        <CircleSlash2 className="size-16 text-destructive"/>
                    </div>
                <CardTitle className="text-2xl">Registrations Closed</CardTitle>
                <CardDescription className="max-w-md mx-auto">We are currently closed for registrations. Please check back later.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/" className={buttonVariants({className:"w-full"})}>
                    <ArrowLeft className="mr-1 size-4"/>
                    Back to home</Link>
                </CardContent>
            </Card>
        </div>
    );
}