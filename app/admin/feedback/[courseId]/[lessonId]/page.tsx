// ============================================
// FILE: app/admin/feedback/[courseId]/[lessonId]/page.tsx
// ============================================
import { adminGetLessonFeedback } from "@/app/data/admin/admin-get-lesson-feedback";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Trophy, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LessonFeedbackContent } from "./_components/LessonFeedbackContent";

type Params = Promise<{ courseId: string; lessonId: string }>;

export default async function LessonFeedbackPage({ params }: { params: Params }) {
  const { courseId, lessonId } = await params;
  const data = await adminGetLessonFeedback(lessonId);

  if (!data) {
    return notFound();
  }

  const hasQuiz = !!data.quiz;
  const hasFeedback = !!data.feedback;

  if (!hasQuiz && !hasFeedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="bg-muted/50 rounded-full p-4 w-fit mx-auto">
              <MessageSquare className="size-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">No Feedback or Quiz</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              This lesson has no quiz and no feedback configured yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`/admin/feedback/${courseId}`}
              className={buttonVariants({ className: "w-full" })}
            >
              <ArrowLeft className="mr-1 size-4" />
              Back to Course
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href={`/admin/feedback/${courseId}`}
      >
        <ArrowLeft className="size-4" />
        <span>Back to Course</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
        <p className="text-muted-foreground">Student Feedback & Quiz Results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {hasFeedback && data.feedback && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
                <MessageSquare className="size-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Feedback</CardTitle>
                <CardDescription>
                  {data.feedback._count.submissions} submission
                  {data.feedback._count.submissions !== 1 ? "s" : ""}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}

        {hasQuiz && data.quiz && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
                <Trophy className="size-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">Quiz</CardTitle>
                <CardDescription>
                  {data.quiz._count.submissions} submission
                  {data.quiz._count.submissions !== 1 ? "s" : ""}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>

      <LessonFeedbackContent lessonId={lessonId} hasQuiz={hasQuiz} hasFeedback={hasFeedback} />
    </div>
  );
}