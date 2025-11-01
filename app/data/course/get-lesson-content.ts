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
           lessonProgress:{
            where:{
               userId: session.user.id,
            },
            select:{
               completed: true,
               lessonId: true,
            }
           },
           quiz: {
             select: {
               id: true,
               title: true,
               questions: {
                 orderBy: {
                   position: 'asc',
                 },
                 select: {
                   id: true,
                   text: true,
                   position: true,
                   options: {
                     orderBy: {
                       position: 'asc',
                     },
                     select: {
                       id: true,
                       text: true,
                       position: true,
                     },
                   },
                   userAnswers: {
                     where: {
                       userId: session.user.id,
                     },
                     select: {
                       id: true,
                       selectedOptionId: true,
                       selectedOption: {
                         select: {
                           isCorrect: true,
                         },
                       },
                     },
                   },
                  
                 },
               },
               submissions: {
                 where: {
                   userId: session.user.id,
                 },
                 select: {
                   id: true,
                   score: true,
                   totalQuestions: true,
                   percentage: true,
                   createdAt: true,
                 },
               },
             },
           },
           
           chapter:{
            select:{
                 
                courseId: true,
                course:{
                    select:{
                        slug:true,
                    }
                }
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