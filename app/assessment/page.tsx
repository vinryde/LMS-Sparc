import { getAssessmentForCourse } from "../data/assessment/get-assessment-for-user";
import { TakeAssessmentComponent } from "./_components/TakeAssessmentComponent";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/general/EmptyState";

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;

  if (!courseId) {
    redirect("/courses");
  }

  const assessment = await getAssessmentForCourse(courseId);

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <EmptyState
          title="No Assessment Available"
          description="This course doesn't have an assessment yet."
          buttonText="Back to Courses"
          href="/courses"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TakeAssessmentComponent assessment={assessment} />
    </div>
  );
}