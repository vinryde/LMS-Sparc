import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetChapter(id: string) {
  await requireAdmin();

  const data = await prisma.chapter.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      position: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      courseId: true,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminChapterType = Awaited<ReturnType<typeof adminGetChapter>>;