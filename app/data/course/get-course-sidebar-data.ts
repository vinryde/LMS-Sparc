import "server-only"
import { requireUser } from "../user/require-user"
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { isEnrollmentExpired } from "@/lib/check-enrollment-expiration";

export async function getCourseSidebarData(slug:string){
    const session = await requireUser();

    const course = await prisma.course.findUnique({
       where:{
        slug: slug,
       },
       select:{
         id:true,
         title: true, 
         fileKey: true,
         duration: true,
         category: true,
         slug:true,
         chapter:{
            orderBy:{
                position:"asc"
            },
            select:{
              id:true,
              title:true,
              position:true,
              lesson:{
                orderBy:{
                    position:"asc"
                },
                select:{
                    id:true,
                    title:true,
                    position:true,
                    description:true,
                    lessonProgress:{
                      where:{
                        userId: session.user.id,
                      },
                      select:{
                        completed:true,
                        lessonId:true,
                        id:true,
                      }  
                    }
                },

              },

            },
         },
       },
    });
    
    if(!course){
        return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
        where:{
           userId_courseId:{
            userId: session.user.id,
            courseId: course.id,
           } 
        }
    });

    if(!enrollment || enrollment.status !== "Completed"){
        return notFound();
    }
    
    // Check if enrollment has expired
    const expired = await isEnrollmentExpired(session.user.id, course.id);
    if(expired){
        redirect(`/course-expired?courseId=${course.id}`);
    }
    
    return {course};
}

export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>;