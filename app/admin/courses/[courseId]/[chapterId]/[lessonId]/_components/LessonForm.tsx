"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition, useState, useEffect } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { updateLesson, getQuizData, getFeedbackData, getResourcesData,getActivitiesData, getInteractiveActivitiesData } from "../actions";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { QuizManager } from "./QuizManager";
import { FeedbackManager } from "./FeedbackManager";
import { ResourceManager } from "./ResourceManager";

// -------------- NEW IMPORTS -------------- //
import { ActivityManager } from "./ActivityManager";
import { InteractiveActivityManager } from "./InteractiveActivityManager";


interface iAppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}

export function LessonForm({ chapterId, data, courseId }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const [quizData, setQuizData] = useState<any>(null);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [resourcesData, setResourcesData] = useState<any[]>([]);

  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  const [isLoadingResources, setIsLoadingResources] = useState(true);

  // -------------- NEW ACTIVITY STATES -------------- //
  const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  const [interactiveActivitiesData, setInteractiveActivitiesData] = useState<any[]>([]);
  const [isLoadingInteractiveActivities, setIsLoadingInteractiveActivities] = useState(true);

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId,
      courseId,
      description: data.description ?? undefined,
      videoKey: data.videoKey ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      documentKey: data.documentKey ?? undefined,
    },
  });

  // -------------- UPDATED FETCH INCLUDING ACTIVITIES -------------- //
  useEffect(() => {
    async function fetchData() {
      setIsLoadingQuiz(true);
      setIsLoadingFeedback(true);
      setIsLoadingResources(true);
      setIsLoadingActivities(true);
      setIsLoadingInteractiveActivities(true);

      try {
        const { data: quizResult } = await tryCatch(getQuizData(data.id));
        if (quizResult) setQuizData(quizResult);

        const { data: feedbackResult } = await tryCatch(getFeedbackData(data.id));
        if (feedbackResult) setFeedbackData(feedbackResult);

        const { data: resourcesResult } = await tryCatch(getResourcesData(data.id));
        if (resourcesResult) setResourcesData(resourcesResult || []);

        // -------- Fetch Activities -------- //
        const { data: activitiesResult } = await tryCatch(getActivitiesData(data.id));
        if (activitiesResult) setActivitiesData(activitiesResult || []);

        // -------- Fetch Interactive Activities -------- //
        const { data: interactiveActivitiesResult } = await tryCatch(getInteractiveActivitiesData(data.id));
        if (interactiveActivitiesResult) setInteractiveActivitiesData(interactiveActivitiesResult || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoadingQuiz(false);
        setIsLoadingFeedback(false);
        setIsLoadingResources(false);
        setIsLoadingActivities(false);
        setIsLoadingInteractiveActivities(false);
      }
    }
    fetchData();
  }, [data.id]);

  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateLesson(values, data.id));
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

      {/* ================= LESSON FORM ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Capsule Configuration</CardTitle>
          <CardDescription>Configure the contents for this Capsule.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Capsule Name</FormLabel>
                  <FormControl><Input placeholder="Capsule Name" {...field} /></FormControl>
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

              <FormField control={form.control} name="documentKey" render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Materials</FormLabel>
                  <FormControl><Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="document" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button disabled={pending} type="submit">
                {pending ? "Saving..." : "Save Capsule"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ================= INTERACTIVE ACTIVITIES SECTION ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Activities (Optional)</CardTitle>
          <CardDescription>Add documents for interactive activities</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInteractiveActivities ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading interactive activities...</div>
            </div>
          ) : (
            <InteractiveActivityManager
              lessonId={data.id}
              initialActivities={interactiveActivitiesData}
              onActivityUpdate={(updated) => setInteractiveActivitiesData(updated)}
            />
          )}
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ================= NEW ACTIVITIES SECTION ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Activities (Optional)</CardTitle>
          <CardDescription>Add engaging activities for students to reinforce their learning</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingActivities ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading activities...</div>
            </div>
          ) : (
            <ActivityManager
              lessonId={data.id}
              initialActivities={activitiesData}
              onActivityUpdate={(updated) => setActivitiesData(updated)}
            />
          )}
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ================= QUIZ SECTION ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz (Optional)</CardTitle>
          <CardDescription>Add an interactive quiz to test learners' understanding</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingQuiz ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading quiz...</div>
            </div>
          ) : (
            <QuizManager
              lessonId={data.id}
              initialQuiz={quizData}
              onQuizUpdate={(updated) => setQuizData(updated)}
            />
          )}
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ================= FEEDBACK SECTION ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Student Feedback (Optional)</CardTitle>
          <CardDescription>Collect feedback for Capsule content</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingFeedback ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading feedback...</div>
            </div>
          ) : (
            <FeedbackManager
              lessonId={data.id}
              initialFeedback={feedbackData}
              onFeedbackUpdate={(updated) => setFeedbackData(updated)}
            />
          )}
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ================= RESOURCES SECTION ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Resources (Optional)</CardTitle>
          <CardDescription>Add notes, links, images, or documents for learners</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingResources ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading resources...</div>
            </div>
          ) : (
            <ResourceManager
              lessonId={data.id}
              initialResources={resourcesData}
              onResourceUpdate={(updated) => setResourcesData(updated)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
