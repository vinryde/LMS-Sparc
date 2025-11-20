import { adminGetAssessmentSubmissions } from "@/app/data/admin/admin-get-assessment-results";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, User, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AssessmentResultsList } from "./_components/AssessmentResultsList";

type Params = Promise<{ assessmentId: string }>;

export default async function AssessmentResultsPage({ params }: { params: Params }) {
  const { assessmentId } = await params;
  const data = await adminGetAssessmentSubmissions(assessmentId);

  if (!data) {
    return notFound();
  }

  const { assessment, submissions, total } = data;

  return (
    <div>
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href="/admin/assessment"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Assessments</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{assessment.title}</h1>
        <p className="text-muted-foreground">Assessment Results</p>
        <div className="flex items-center gap-2 mt-3">
          <Link 
            href={`/courses/${assessment.course.slug}`}
            className="text-sm text-primary hover:underline"
          >
            {assessment.course.title}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
              <User className="size-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">Total Submissions</CardTitle>
              <CardDescription>
                {total} student{total !== 1 ? "s" : ""} completed
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
              <Trophy className="size-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">Average Score</CardTitle>
              <CardDescription>
                {submissions.length > 0
                  ? Math.round(
                      submissions.reduce((sum, s) => sum + s.knowledgePercentage, 0) /
                        submissions.length
                    )
                  : 0}
                % average
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <AssessmentResultsList 
        assessmentId={assessmentId}
        initialSubmissions={submissions}
        initialHasMore={data.hasMore}
      />
    </div>
  );
}