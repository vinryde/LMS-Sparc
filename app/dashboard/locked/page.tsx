import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function LockedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const slug = params.slug;
  const backLink = slug ? `/dashboard/${slug}` : `/dashboard`;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <LockKeyhole className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Module Content Locked</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Complete all capsules in the previous module to access this capsule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={backLink} className={buttonVariants({ className: "w-full" })}>
            <ArrowLeft className="mr-1 size-4" />
            Back to Course
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}