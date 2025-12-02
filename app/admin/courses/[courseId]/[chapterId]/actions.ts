"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { chapterDetailsSchema, ChapterDetailsSchemaType } from "@/lib/zodSchema";

export async function updateChapterDetails(values: ChapterDetailsSchemaType, chapterId: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = chapterDetailsSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId: result.data.courseId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      },
    });

    return {
      status: "success",
      message: "Module updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update module",
    };
  }
}