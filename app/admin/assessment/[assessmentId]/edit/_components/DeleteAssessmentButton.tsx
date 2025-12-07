"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAssessment } from "../../actions";

interface DeleteAssessmentButtonProps {
  assessmentId: string;
}

export function DeleteAssessmentButton({ assessmentId }: DeleteAssessmentButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteAssessment(assessmentId));
      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      if (result?.status === "success") {
        toast.success(result.message);
        router.push("/admin/assessment");
      } else {
        toast.error(result?.message || "Failed to delete assessment");
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="size-4" />
          Delete Assessment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this assessment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All sections, questions, and submissions will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onDelete} disabled={pending}>
            {pending ? (
              <>
                Deleting...
                <Loader2 className="animate-spin ml-1" />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}