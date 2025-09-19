'use client';
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ui/themeToggle";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {toast} from "sonner"
import Link from "next/link";
export default function Home() {
  const router= useRouter();
  async function signOut(){
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
          toast.success("Logged out successfully");
        },
      },
    });

  }
  const { 
    data: session, 
} = authClient.useSession(); 

  return (
    <div>
    <h1> hello world </h1>
    <ThemeToggle/>
    {
      session ? <div> 
        <p>{session.user.name}</p>
        <Button onClick={signOut}>LogOut</Button>
        </div>
      : 
      <Link href="./login">
      <Button>Login</Button>
      </Link>
    }
    </div>
  );
}
