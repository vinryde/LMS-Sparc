import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";

export async function getDashboardStats(){
   await requireAdmin();
   const[totalUsers,totalCourses,totalEnrollments,totalLessons]= await Promise.all([
    prisma.user.count(
        {
            where:{
                role: "Student",
            }
        }
    ),
    prisma.course.count(), 
    prisma.enrollment.count(),
    prisma.lesson.count(),
   ]);
   return{
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalLessons,
   }
}