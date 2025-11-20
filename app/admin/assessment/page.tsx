import { adminGetAllAssessments } from "@/app/data/admin/admin-get-assessment";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/general/EmptyState";
import Link from "next/link";
import { BookCheck, Users, GraduationCap, ClipboardList } from "lucide-react";

export default async function AssessmentsPage() {
  const assessments = await adminGetAllAssessments();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Assessments
        </h1>
        <Link className={buttonVariants()} href="/admin/assessment/create">
          Create Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          title="No Assessments Found"
          description="Create a new assessment to get started."
          buttonText="Create Assessment"
          href="/admin/assessment/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <BookCheck className="size-5 text-primary" />
                      {assessment.title}
                    </CardTitle>
                    {assessment.description && (
                      <CardDescription className="mt-2">{assessment.description}</CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  <Link 
                    href={`/courses/${assessment.course.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {assessment.course.title}
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sections:</span>
                  <span className="font-medium">{assessment._count.sections}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="size-4" />
                    Submissions:
                  </span>
                  <span className="font-medium">{assessment._count.submissions}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/assessment/${assessment.id}/edit`}
                    className={buttonVariants({ variant: "default", className: "flex-1" })}
                  >
                    Edit Assessment
                  </Link>
                  <Link
                    href={`/admin/assessment/results/${assessment.id}`}
                    className={buttonVariants({ variant: "outline", className: "flex-1" })}
                  >
                    <ClipboardList className="size-4 mr-2" />
                    Assessment Results
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}