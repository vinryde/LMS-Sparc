"use client";

import { tryCatch } from "@/hooks/try-catch";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2, PlusIcon } from "lucide-react";
import { checkIfAssessmentCompleted } from "../[slug]/actions";
import { enrollInCourseAction } from "../[slug]/actions";

interface EnrollButtonProps {
  courseId: string;
  enrolled: boolean;
}

export function EnrollButton({ courseId, enrolled }: EnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(enrolled);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerConfetti } = useConfetti();

  async function onSubmit(courseId: string) {
    startTransition(async () => {
      // Check if user already completed assessment
      const { data: hasCompleted, error: checkError } = await tryCatch(
        checkIfAssessmentCompleted(courseId)
      );

      if (checkError) {
        toast.error("Login to enroll in the course");
        return;
      }

      if (hasCompleted) {
        // User already completed assessment, directly enroll
        const { data: result, error } = await tryCatch(enrollInCourseAction(courseId));

        if (error) {
          toast.error("Failed to enroll in the course");
          return;
        }

        if (result?.status === "success") {
          toast.success(result.message);
          setIsEnrolled(true);
          triggerConfetti();
          router.push("/dashboard");
        } else if (result?.status === "error") {
          toast.error(result.message);
        } else if (result?.status === "enrolled") {
          toast.error(result.message);
          router.push("/dashboard");
        }
      } else {
        // User needs to complete assessment first
        toast.info("Please complete the assessment to enroll");
        router.push(`/assessment?courseId=${courseId}`);
      }
    });
  }

  return (
    <Button
      onClick={() => onSubmit(courseId)}
      disabled={isPending || isEnrolled}
      className="w-full"
    >
      {isPending ? (
        <>
          Processing... <Loader2 className="animate-spin ml-1" />
        </>
      ) : isEnrolled ? (
        <>
          You're Already Enrolled <CheckIcon className="ml-2" size={18} />
        </>
      ) : (
        <>
          Enroll Now <PlusIcon className="ml-2" size={18} />
        </>
      )}
    </Button>
  );
}