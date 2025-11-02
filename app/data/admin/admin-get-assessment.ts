import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";

export async function adminGetAssessment(assessmentId: string) {
  await requireAdmin();

  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      courseId: true, 
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

  return assessment;
}

export async function adminGetAllAssessments() {
  await requireAdmin();

  const assessments = await prisma.assessment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      courseId: true, 
      course: {     
        select: {
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          sections: true,
          submissions: true,
        },
      },
    },
  });

  return assessments;
}

export type AdminAssessmentType = Awaited<ReturnType<typeof adminGetAssessment>>;
export type AdminAssessmentListType = Awaited<ReturnType<typeof adminGetAllAssessments>>[0];