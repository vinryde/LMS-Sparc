import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export async function getLessonQuiz(lessonId: string) {
  const session = await requireUser();
  
  const quiz = await prisma.quiz.findUnique({
    where: {
      lessonId: lessonId,
    },
    select: {
      id: true,
      title: true,
      questions: {
        orderBy: {
          position: 'asc',
        },
        select: {
          id: true,
          text: true,
          options: {
            orderBy: {
              position: 'asc',
            },
            select: {
              id: true,
              text: true,
              // Don't expose isCorrect to frontend
            },
          },
          userAnswers: {
            where: {
              userId: session.user.id,
            },
            select: {
              id: true,
              selectedOptionId: true,
            },
          },
        },
      },
    },
  });

  return quiz;
}

export type LessonQuizType = Awaited<ReturnType<typeof getLessonQuiz>>;