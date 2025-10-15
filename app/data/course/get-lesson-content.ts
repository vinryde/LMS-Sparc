import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
export async function getLessonContent(lessonId:string){
    const session = await requireUser();
    const lesson = await prisma.lesson.findUnique({
        where:{
            id:lessonId,
        },
        select:{
           id:true,
           title:true,
           position:true,
           description:true,
           thumbnailKey:true,
           documentKey:true,
           videoKey:true,
           chapter:{
            select:{
                courseId: true,
            } 
           }
        }
    });
    if(!lesson){
        return notFound();
    }
    
    const enrollment = await prisma.enrollment.findUnique({
        where:{
            userId_courseId:{
                userId:session.user.id,
                courseId: lesson.chapter.courseId,
            },
        },
        select:{
           status:true,
        }
    });
    if(!enrollment||enrollment.status !== "Completed"){
        return notFound();
    }
    return lesson;

}
export type LessonContentType= Awaited<ReturnType<typeof getLessonContent>>;