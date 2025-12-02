"use client";

import { ChevronDown, Play } from "lucide-react";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Link from "next/link";

interface iAppProps {
    course: CourseSidebarDataType['course'];
    onItemClick?: () => void;
}

export function CourseSidebarContent({ course, onItemClick }: iAppProps) {
    const pathname = usePathname();
    const currentLessonId = pathname.split("/").pop();
    const { totallessons, completedlessons, progressPercentage } = useCourseProgress({ courseData: course });

    return (
        <div className="flex flex-col h-full">
            <div className="pb-4 px-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Play className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-semibold text-base leading-tight truncate">
                            {course.title}
                        </h1>
                        <p className="text-xs mt-1 truncate text-muted-foreground">
                            {course.category}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completedlessons}/{totallessons} lessons</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">
                        {progressPercentage}% completed
                    </p>
                </div>
            </div>

            <div className="py-4 px-4 space-y-3 overflow-y-auto flex-1">
                {course.chapter.map((chapter, index) => (
                    <Collapsible key={chapter.id} defaultOpen={index === 0}>
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full p-3 h-auto flex items-center gap-2">
                                <div className="shrink-0">
                                    <ChevronDown className="size-4 text-primary" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                   <p className="font-semibold text-sm truncate text-foreground">
                                        {/* Chapter title link */}
                                        <Link
                                          href={`/dashboard/${course.slug}/chapter/${chapter.id}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onItemClick?.();
                                          }}
                                          className="hover:underline"
                                        >
                                          {chapter.position}: {chapter.title}
                                        </Link>
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-medium truncate">
                                        {chapter.lesson.length} lessons
                                    </p>
                                </div>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 pl-6 space-y-3 border-l-2">
                            {chapter.lesson.map((lesson) => (
                                <div key={lesson.id} onClick={onItemClick}>
                                    <LessonItem
                                        lesson={lesson}
                                        slug={course.slug}
                                        isActive={lesson.id === currentLessonId}
                                        completed={lesson.lessonProgress.find((progress) => progress.lessonId === lesson.id)?.completed || false}
                                    />
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}