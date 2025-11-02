import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getAssessmentForCourse(courseId: string) {
  const session = await requireUser();

  const assessment = await prisma.assessment.findUnique({
    where: {
      courseId: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      courseId: true,
      sections: {
        orderBy: {
          position: 'asc',
        },
        select: {
          id: true,
          title: true,
          type: true,
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
                  position: true,
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
      },
      submissions: {
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          knowledgeScore: true,
          knowledgeTotal: true,
          knowledgePercentage: true,
          completed: true,
          createdAt: true,
        },
      },
    },
  });

  if (!assessment) {
    return null; // Return null instead of notFound to handle missing assessments gracefully
  }

  return assessment;
}

export type UserCourseAssessmentType = Awaited<ReturnType<typeof getAssessmentForCourse>>;