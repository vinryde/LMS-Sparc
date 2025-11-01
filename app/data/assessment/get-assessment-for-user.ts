import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getAssessmentForUser() {
  const session = await requireUser();

  // Get the first (and only) assessment
  const assessment = await prisma.assessment.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      description: true,
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
    return notFound();
  }

  return assessment;
}

export type UserAssessmentType = Awaited<ReturnType<typeof getAssessmentForUser>>;