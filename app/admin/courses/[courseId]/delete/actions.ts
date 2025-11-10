"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/lib/type";
import arcjet, { fixedWindow } from '@/lib/arcjet';
import {request} from '@arcjet/next';

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
   const session = await requireAdmin()

    try {
         const req = await request();
    const decision= await aj.protect(req,{
        fingerprint: session?.user.id as string,
    });

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
        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });

        revalidatePath("/courses");
        return {
            status: "success",
            message:"Course Deleted Successfully",
        };
    } catch(error) {
        console.log(error);
       return {
        status: "error",
        message:"Failed to delete course.",
       };
    }
}