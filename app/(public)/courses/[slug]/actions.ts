"use server";
import { ApiResponse } from "@/lib/type";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse>{
    const session= await requireUser();
    try{
        const course = await prisma.course.findUnique({
            where:{
                id: courseId,
            },
            select:{
                id:true,
                title: true,
                slug: true,
            }
        });
        if(!course){
            return{
                status: "error",
                message:"Course not found",
            };
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
            where:{
                userId_courseId: {
                    userId: session?.user.id,
                    courseId: course.id,
                }
            }
        });
        if(existingEnrollment){
            return{
                status: "enrolled",
                message:"You have already enrolled in this course",
            };
        }
        const enrollment= await prisma.enrollment.create({
            data:{
                courseId: course.id,
                userId: session?.user.id,
                status: "Completed",
            }
        });
        return{
            status: "success",
            message:"You have successfully enrolled in the course",
        };
       

}
catch(error){
    console.error("Error enrolling in course:", error);
    return{
        status: "error",
        message:"Failed to enroll in the course",
    };
}
}

export async function checkIfAssessmentCompleted(courseId: string): Promise<boolean> {
  const session = await requireUser();
  
  try {
    // Get the assessment for this specific course
    const assessment = await prisma.assessment.findUnique({
      where: {
        courseId: courseId,
      },
      select: {
        id: true,
      },
    });

    if (!assessment) {
      return false; // No assessment for this course
    }

    const submission = await prisma.assessmentSubmission.findFirst({
      where: {
        userId: session.user.id,
        assessmentId: assessment.id,
      },
    });
    
    return !!submission;
  } catch {
    return false;
  }
}
