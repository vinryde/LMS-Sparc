import { adminGetAssessment } from "@/app/data/admin/admin-get-assessment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentStructure } from "./_components/AssessmentStructure";
import { notFound } from "next/navigation";

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
          </CardHeader>
        </Card>

        <AssessmentStructure data={assessment} />
      </div>
    </div>
  );
}