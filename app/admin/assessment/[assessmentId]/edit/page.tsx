import { adminGetAssessment } from "@/app/data/admin/admin-get-assessment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentStructure } from "./_components/AssessmentStructure";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { EditAssessmentForm } from "./_components/EditAssessmentForm";
import { DeleteAssessmentButton } from "./_components/DeleteAssessmentButton";

type Params = Promise<{ assessmentId: string }>;

export default async function EditAssessmentPage({ params }: { params: Params }) {
  const { assessmentId } = await params;
  const assessment = await adminGetAssessment(assessmentId);

  if (!assessment) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Assessment: <span className="text-primary underline">{assessment.title}</span>
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Information</CardTitle>
            <CardDescription>
              {assessment.description || "No description provided"}
            </CardDescription>
            <div className="flex items-center gap-2 mt-4">
              <GraduationCap className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Course:</span>
              <Link 
                href={`/courses/${assessment.course.slug}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                {assessment.course.title}
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Update the title and description below. Course is fixed for this assessment.
              </p>
              <DeleteAssessmentButton assessmentId={assessment.id} />
            </div>
            <EditAssessmentForm data={assessment} />
          </CardContent>
        </Card>

        <AssessmentStructure data={assessment} />
      </div>
    </div>
  );
}