import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, CalendarX } from "lucide-react";
import Link from "next/link";

export default async function CourseExpiredPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto mb-4">
            <CalendarX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Course Access Expired</CardTitle>
          <CardDescription className="max-w-md mx-auto text-base mt-2">
            Your enrollment in this course has expired. Course access is valid for 30 days from the date of enrollment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium">Need access extended?</p>
            <p className="text-muted-foreground">
              Please contact the course administrator or support team to request an extension for this course.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Link 
              href="/dashboard" 
              className={buttonVariants({ className: "w-full" })}
            >
              <ArrowLeft className="mr-1 size-4" />
              Back to Dashboard
            </Link>
            <Link 
              href="/courses" 
              className={buttonVariants({ variant: "outline", className: "w-full" })}
            >
              Explore Other Courses
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}