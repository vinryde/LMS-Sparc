"use client";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";
interface iAppProps{
    courseData: CourseSidebarDataType["course"]
}

interface CourseProgressResult{
    totallessons: number;
    completedlessons: number;
    progressPercentage: number;
}

export function useCourseProgress({courseData}:iAppProps):CourseProgressResult{
    return useMemo(()=>{
        let totallessons=0;
        let completedlessons=0;
        courseData.chapter.forEach((chapter)=>{
            chapter.lesson.forEach((lesson)=>{
                totallessons++;

                const isCompleted = lesson.lessonProgress.some(
                    (progress)=>progress.lessonId===lesson.id && progress.completed
                );
                if(isCompleted){
                    completedlessons++;
                }
            })
        });
       const progressPercentage= totallessons>0? Math.round((completedlessons/totallessons)*100):0;
        return{
            totallessons,
            completedlessons,
            progressPercentage,
        }
    },[courseData]);
}