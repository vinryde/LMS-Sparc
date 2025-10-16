import "server-only"
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";

export async function getEnrolledCourses(){
   const user=  await requireUser();
   const data= await prisma.enrollment.findMany({
     where:{
        userId: user.session.userId,
        status: "Completed",
     },
     select:{
        course:{
            select:{
                id:true,
                title:true,
                smallDescription:true,
                duration:true,
                level:true,
                status: true,
                fileKey:true,
                slug:true,
                chapter:{
                    select:{
                        id:true,
                        lesson:{
                            select:{
                                id:true,
                                lessonProgress:{
                                    where:{
                                        userId: user.session.userId,
                                    },
                                    select:{
                                        completed:true,
                                        lessonId:true,
                                        id:true,
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }
        }
     },
   });
   return data;
}
export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourses>>[0];