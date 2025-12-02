"use client";

import { AdminChapterType } from "@/app/data/admin/admin-get-chapter";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chapterDetailsSchema, ChapterDetailsSchemaType } from "@/lib/zodSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { updateChapterDetails } from "../actions";
import { toast } from "sonner";

interface iAppProps {
  data: AdminChapterType;
  courseId: string;
}

export function ChapterForm({ data, courseId }: iAppProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<ChapterDetailsSchemaType>({
    resolver: zodResolver(chapterDetailsSchema),
    defaultValues: {
      name: data.title,
      courseId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });

  function onSubmit(values: ChapterDetailsSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateChapterDetails(values, data.id));
      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      result.status === "success" ? toast.success(result.message) : toast.error(result.message);
    });
  }

  return (
    <div>
      <Link className={buttonVariants({ variant: "outline", className: "mb-6" })} href={`/admin/courses/${courseId}/edit`}>
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Module Configuration</CardTitle>
          <CardDescription>Configure the contents for this Module.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Name</FormLabel>
                  <FormControl><Input placeholder="Module Name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><RichTextEditor field={field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="thumbnailKey" render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl><Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="videoKey" render={({ field }) => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormControl><Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button disabled={pending} type="submit">
                {pending ? "Saving..." : "Save Module"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}