import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetAssessmentSubmissions(
  assessmentId: string,
  page: number = 1,
  limit: number = 20
) {
  await requireAdmin();

  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        id: true,
        title: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!assessment) {
      return notFound();
    }

    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      prisma.assessmentSubmission.findMany({
        where: {
          assessmentId: assessmentId,
        },
        select: {
          id: true,
          knowledgeScore: true,
          knowledgeTotal: true,
          knowledgePercentage: true,
          completed: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.assessmentSubmission.count({
        where: {
          assessmentId: assessmentId,
        },
      }),
    ]);

    return {
      assessment,
      submissions,
      total,
      hasMore: skip + submissions.length < total,
    };
  } catch (error) {
    console.error("Error fetching assessment submissions:", error);
    throw error;
  }
}

export async function adminGetUserAssessmentResults(
  assessmentId: string,
  userId: string
) {
  await requireAdmin();

  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        id: true,
        title: true,
        description: true,
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
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
                    isCorrect: true,
                    position: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      return notFound();
    }

    const submission = await prisma.assessmentSubmission.findUnique({
      where: {
        userId_assessmentId: {
          userId: userId,
          assessmentId: assessmentId,
        },
      },
      select: {
        id: true,
        knowledgeScore: true,
        knowledgeTotal: true,
        knowledgePercentage: true,
        completed: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      return notFound();
    }

    const userAnswers = await prisma.userAssessmentAnswer.findMany({
      where: {
        userId: userId,
        question: {
          section: {
            assessmentId: assessmentId,
          },
        },
      },
      select: {
        id: true,
        questionId: true,
        selectedOptionId: true,
        selectedOption: {
          select: {
            id: true,
            text: true,
            isCorrect: true,
          },
        },
      },
    });

    return {
      assessment,
      submission,
      userAnswers,
    };
  } catch (error) {
    console.error("Error fetching user assessment results:", error);
    throw error;
  }
}

export type AdminAssessmentSubmissionsType = Awaited<ReturnType<typeof adminGetAssessmentSubmissions>>;
export type AdminUserAssessmentResultsType = Awaited<ReturnType<typeof adminGetUserAssessmentResults>>;