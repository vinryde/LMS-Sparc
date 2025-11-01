import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";

export async function adminGetQuiz(lessonId: string) {
  await requireAdmin();

  const quiz = await prisma.quiz.findUnique({
    where: {
      lessonId: lessonId,
    },
    select: {
      id: true,
      title: true,
      position: true,
      questions: {
        orderBy: {
          position: 'asc',
        },
        select: {
          id: true,
          text: true,
          position: true,
          options: {
            orderBy: {
              position: 'asc',
            },
            select: {
              id: true,
              text: true,
              isCorrect: true,
              position: true,
            },
          },
        },
      },
    },
  });

  return quiz; // Can be null if no quiz exists
}

export type AdminQuizType = Awaited<ReturnType<typeof adminGetQuiz>>;