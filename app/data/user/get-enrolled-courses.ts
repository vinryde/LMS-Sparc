import "server-only"
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";
import { checkAndUpdateExpiredEnrollments } from "@/lib/check-enrollment-expiration";

export async function getEnrolledCourses(){
   const user = await requireUser();
   
   await checkAndUpdateExpiredEnrollments();
   
   const data = await prisma.enrollment.findMany({
     where:{
        userId: user.session.userId,
        status: "Completed",
        isExpired: false, 
     },
     select:{
        id: true,
        expiresAt: true,
        isExpired: true,
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

export async function getExpiredCourses(){
   const user = await requireUser();
   
   await checkAndUpdateExpiredEnrollments();
   
   const data = await prisma.enrollment.findMany({
     where:{
        userId: user.session.userId,
        OR: [
          { status: "Expired" },
          { isExpired: true }
        ]
     },
     select:{
        id: true,
        expiresAt: true,
        isExpired: true,
        createdAt: true,
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
            }
        }
     },
     orderBy: {
       expiresAt: 'desc'
     }
   });
   return data;
}

export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourses>>[0];
export type ExpiredCourseType = Awaited<ReturnType<typeof getExpiredCourses>>[0];