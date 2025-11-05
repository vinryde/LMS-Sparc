import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetLessonFeedback(lessonId: string) {
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      quiz: {
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      },
      feedback: {
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return notFound();
  }

  return lesson;
}