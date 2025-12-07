"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { assessmentSchema, AssessmentSchemaType } from "@/lib/zodSchema";
import { tryCatch } from "@/hooks/try-catch";
import { createOrUpdateAssessment } from "../../actions";
import type { AdminAssessmentType } from "@/app/data/admin/admin-get-assessment";

interface EditAssessmentFormProps {
  data: NonNullable<AdminAssessmentType>;
}

export function EditAssessmentForm({ data }: EditAssessmentFormProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<AssessmentSchemaType>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: data.title,
      description: data.description ?? "",
      courseId: data.courseId,
    },
  });

  function onSubmit(values: AssessmentSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createOrUpdateAssessment(values, data.id));
      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      if (result?.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Failed to update assessment");
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Title</FormLabel>
              <FormControl>
                <Input placeholder="Pre-Course Assessment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="This assessment evaluates students' baseline knowledge..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button disabled={pending} type="submit">
            {pending ? (
              <>
                Saving...
                <Loader2 className="animate-spin ml-1" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}