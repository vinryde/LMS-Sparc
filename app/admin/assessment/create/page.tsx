"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { assessmentSchema, AssessmentSchemaType } from "@/lib/zodSchema";
import { tryCatch } from "@/hooks/try-catch";
import { createOrUpdateAssessment } from "../[assessmentId]/actions";

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AssessmentSchemaType>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: AssessmentSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createOrUpdateAssessment(values));
      
      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      
      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/assessment");
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/assessment"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Create Assessment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
          <CardDescription>
            Create a new assessment with knowledge, attitude, and behaviour sections
          </CardDescription>
        </CardHeader>
        <CardContent>
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

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    Creating...
                    <Loader2 className="animate-spin ml-1" />
                  </>
                ) : (
                  "Create Assessment"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}