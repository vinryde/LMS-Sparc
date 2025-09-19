"use client";
import { Button } from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function VerifyRequest(){
    const router = useRouter();
    const[otp, setOtp]= useState("");
    const[emailPending, startTransition]= useTransition();
    const params = useSearchParams();
    const email = params.get('email') as string;
    const isOtpCompleted = otp.length === 6;
    function verifyOtp(){
        startTransition(async()=>{
            await authClient.signIn.emailOtp(
                {
                    email: email,
                    otp: otp,
                    fetchOptions: {
                       onSuccess: () =>{
                        toast.success('Account verified successfully');
                        router.push('/');
                       },
                      onError: () =>
                      {
                        toast.error("Error verifying account. Please try again.")
                      }
                    }
                    

                }
            )
    })
}
    return(
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please Check Your Email</CardTitle>
                <CardDescription>
                    We have sent a verification code to your email address. Please open your email and paste the code below.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center">
                    <InputOTP maxLength={6} className="gap-2" value={otp} onChange={(value)=> setOtp(value)}>
                    <InputOTPGroup>
                    <InputOTPSlot index={0}/>
                    <InputOTPSlot index={1}/>
                    <InputOTPSlot index={2}/>
                    </InputOTPGroup>
                    <InputOTPGroup>
                    <InputOTPSlot index={3}/>
                    <InputOTPSlot index={4}/>
                    <InputOTPSlot index={5}/>
                    </InputOTPGroup>
                    </InputOTP>
                    <p className="text-xs text-muted-foreground mt-2"> Enter the 6-digit code sent to your email</p>
                </div>
                <Button onClick={verifyOtp} disabled={emailPending || !isOtpCompleted} className="w-full">Verify Account</Button>
            </CardContent>

        </Card>

    )
}