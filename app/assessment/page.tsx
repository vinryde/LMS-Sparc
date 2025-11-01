import { getAssessmentForUser } from "../data/assessment/get-assessment-for-user";
import { TakeAssessmentComponent } from "./_components/TakeAssessmentComponent";

export default async function AssessmentPage() {
  const assessment = await getAssessmentForUser();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TakeAssessmentComponent assessment={assessment} />
    </div>
  );
}