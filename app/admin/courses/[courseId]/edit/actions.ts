"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import {request} from '@arcjet/next';

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow:[],
  })
).withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);  


export async function EditCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const user = await requireAdmin();

    try {
        const req= await request();
        const decision= await aj.protect(req,{
            fingerprint: user.user.id,
        })

        if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            return{
                status: "error",
                message:"You have been blocked due to rate limiting..",
            };
        }
        else{
            return{
                status: "error",
                message:"Looks like you are a bot, please try again later. If not, contact our support team.",
            };
        }
    }
        const result = courseSchema.safeParse(data);
        if(!result.success){
            return{
                status: "error",
                message:"Invalid Data",
            };
        }

    await prisma.course.update({
        where:{
            id: courseId,
            userId: user.user.id,
        },
        data: {
            ...result.data,
        }
    }); 

return {
    status: "success",
    message: "Course updated successfully",
};
       

    } catch {
        return{
            status: "error",
            message:"Internal Server Error",
        };
    }
}