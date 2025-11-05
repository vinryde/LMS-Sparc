import { adminGetCourseFeedbackStructure } from "@/app/data/admin/admin-get-course-feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { FeedbackStructure } from "./_components/FeedbackStructure";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Params = Promise<{ courseId: string }>;

export default async function CourseFeedbackPage({ params }: { params: Params }) {
  const { courseId } = await params;
  const course = await adminGetCourseFeedbackStructure(courseId);

  if (!course) {
    return notFound();
  }

  return (
    <div>
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href="/admin/feedback"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Courses</span>
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        Feedback: <span className="text-primary underline">{course.title}</span>
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Course Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackStructure data={course} />
        </CardContent>
      </Card>
    </div>
  );
}