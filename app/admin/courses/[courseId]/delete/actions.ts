"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/lib/type";

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
    await requireAdmin()

    try {
        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });

        revalidatePath("/admin/courses");
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