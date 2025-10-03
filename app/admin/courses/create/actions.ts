"use server";

import { prisma } from "@/lib/db";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { ApiResponse } from "@/lib/type";
import { requireAdmin } from "@/app/data/admin/require-admin";
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

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse>{
    const session= await requireAdmin();
 try{
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
    const validation = courseSchema.safeParse(values);
    if(!validation.success){
        return{
            status: "error",
            message:"Invalid Form Data",
        };
    }
    const data = await prisma.course.create({
        data:{
            ...validation.data,
            userId:session?.user.id as string,
        }
    });
    return{
        status: "success",
        message:"Course Created",
    };
 }
 catch{
    return{
        status: "error",
        message:"Internal Server Error",
    };
 }
}