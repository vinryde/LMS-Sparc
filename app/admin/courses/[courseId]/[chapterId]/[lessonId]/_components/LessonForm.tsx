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
import { updateLesson, getQuizData } from "../actions";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { QuizManager } from "./QuizManager";

interface iAppProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string;
}

export function LessonForm({chapterId, data, courseId}: iAppProps) {
    const [pending, startTransition] = useTransition();
    const [quizData, setQuizData] = useState<any>(null);
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
    
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
            documentKey: data.documentKey ?? undefined,
        },
    });

    // Fetch quiz data on mount
    useEffect(() => {
        async function fetchQuiz() {
            setIsLoadingQuiz(true);
            try {
                const { data: result, error } = await tryCatch(getQuizData(data.id));
                if (!error && result) {
                    setQuizData(result);
                }
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
            } finally {
                setIsLoadingQuiz(false);
            }
        }
        fetchQuiz();
    }, [data.id]);

    function onSubmit(values: LessonSchemaType) {
        startTransition(async()=>{
            const{data:result,error}= await tryCatch(updateLesson(values, data.id));
            if(error){
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }
            if(result.status=== 'success'){
                toast.success(result.message);
            }
            else if(result.status === 'error'){
                toast.error(result.message);
            }
        });
    }

    return (
        <div>
            <Link className={buttonVariants ({variant: 'outline', className:'mb-6'})} href={`/admin/courses/${courseId}/edit`}>
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
            </Link>
            
            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>Configure the video and description for this lesson.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="name" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Lesson Name 
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lesson Name"{...field} /> 
                                    </FormControl>
                                    <FormMessage/> 
                                </FormItem>
                            )}/> 

                            <FormField control={form.control} name="description" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <RichTextEditor field={field} /> 
                                    </FormControl>
                                    <FormMessage/> 
                                </FormItem>
                            )}/> 

                            <FormField control={form.control} name="thumbnailKey" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Thumbnail Image
                                    </FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image" />
                                    </FormControl>
                                    <FormMessage/> 
                                </FormItem>
                            )}/> 

                            <FormField control={form.control} name="videoKey" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Video File
                                    </FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video" />
                                    </FormControl>
                                    <FormMessage/> 
                                </FormItem>
                            )}/> 

                            <FormField control={form.control} name="documentKey" render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Study Materials
                                    </FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="document" />
                                    </FormControl>
                                    <FormMessage/> 
                                </FormItem>
                            )}/> 
                            
                            <Button disabled={pending} type="submit">
                                {pending ? 'Saving..' : "Save Lesson"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Separator className="my-6" />

            {/* Quiz Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Quiz (Optional)</CardTitle>
                    <CardDescription>
                        Add an interactive quiz to test learners' understanding of this lesson
                    </CardDescription>
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
                            onQuizUpdate={(updatedQuiz) => setQuizData(updatedQuiz)}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}