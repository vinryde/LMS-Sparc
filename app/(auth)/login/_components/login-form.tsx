"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, Loader, MailIcon, SendIcon  } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTransition } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router= useRouter();
    const[googlePending, startGoogleTransition] = useTransition();
    const[emailPending, startEmailTransition] = useTransition();
    const [email, setEmail] = useState("");
    async function signInWithGoogle(){
        startGoogleTransition(async()=>{
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
                
                fetchOptions:{
                    onSuccess: () =>{
                        toast.success('Signed in successfully! You will be redirected..');
                        
                    },
                    onError:(error) =>{
                        toast.error(error.error.message);
                    }
                }
            });

        });
       
    }
    function signInWithEmail(){
        startEmailTransition(async()=>{
            await authClient.emailOtp.sendVerificationOtp({
              email: email,
              type : 'sign-in',
              fetchOptions:{
                onSuccess: () =>{
                    toast.success('Verification OTP sent successfully! You will be redirected..');
                    router.push(`/verify-request`);
                },
                onError:(error) =>{
                    toast.error(error.error.message);
                }
              }
            })
        })
    }
  return (
    <Card>
            <CardHeader>
                <CardTitle className="text-xl">
                 Login
                </CardTitle>
                <CardDescription>
                    Login with your Google or Email account!

                </CardDescription>
                <CardContent className="flex flex-col gap-4">
                   <Button onClick={signInWithGoogle} disabled={googlePending}  className="w-full" variant={"outline"}>
                    {googlePending ? (
                        <>
                        <Loader className="size-4 animate-spin"/>
                        <span>Loading..</span>
                        </>
                    ):(
                        <>
                         <MailIcon className="size-4"/>
                         Sign in with Google
                        </>
                    )}
                   
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-card px-2 text-muted-foreground">or continue with</span>
                    </div>
                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="johndoe@example.com" required/>
                        </div>
                        <Button onClick={signInWithEmail} disabled={emailPending}>{emailPending ? (
                        <>
                        <Loader className="size-4 animate-spin"/>
                        <span>Loading..</span>
                        </>
                    ):(
                        <>
                         <SendIcon className="size-4"/>
                         Continue With Email
                        </>
                    )}</Button>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
  )
}