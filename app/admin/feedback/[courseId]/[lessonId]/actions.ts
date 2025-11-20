"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";

export async function getStudentFeedbackData(
  lessonId: string,
  page: number = 1,
  limit: number = 10
) {
  await requireAdmin();

  try {
    // Get lesson with quiz and feedback
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        quiz: {
          select: {
            id: true,
          },
        },
        feedback: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const quizId = lesson.quiz?.id;
    const feedbackId = lesson.feedback?.id;

    // If no quiz and no feedback, return empty
    if (!quizId && !feedbackId) {
      return {
        students: [],
        hasMore: false,
        total: 0,
      };
    }

    // Build the where clause dynamically
    const whereClause: any = {
      OR: [],
    };

    if (feedbackId) {
      whereClause.OR.push({
        feedbackSubmissions: {
          some: {
            feedbackId: feedbackId,
          },
        },
      });
    }

    if (quizId) {
      whereClause.OR.push({
        quizSubmissions: {
          some: {
            quizId: quizId,
          },
        },
      });
    }

    // Get all users who have either submitted feedback or quiz
    const usersWithSubmissions = await prisma.user.findMany({
      where: whereClause.OR.length > 0 ? whereClause : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        feedbackSubmissions: feedbackId
          ? {
              where: { feedbackId },
              select: {
                content: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            }
          : undefined,
        quizSubmissions: quizId
          ? {
              where: { quizId },
              select: {
                score: true,
                totalQuestions: true,
                percentage: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            }
          : undefined,
      },
    });

    // Sort by latest submission (feedback or quiz)
    const studentsWithData = usersWithSubmissions
      .map((user) => {
        const feedbackSubmission = user.feedbackSubmissions?.[0];
        const quizSubmission = user.quizSubmissions?.[0];

        const feedbackDate = feedbackSubmission?.createdAt
          ? new Date(feedbackSubmission.createdAt).getTime()
          : 0;
        const quizDate = quizSubmission?.createdAt
          ? new Date(quizSubmission.createdAt).getTime()
          : 0;

        const latestSubmission = Math.max(feedbackDate, quizDate);

        return {
          userId: user.id,
          userName: user.name || user.email?.split("@")[0] || "Unknown",
          userEmail: user.email,
          feedback: feedbackSubmission || null,
          quizSubmission: quizSubmission || null,
          latestSubmission: new Date(latestSubmission),
        };
      })
      .sort((a, b) => b.latestSubmission.getTime() - a.latestSubmission.getTime());

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = studentsWithData.slice(startIndex, endIndex);
    const hasMore = endIndex < studentsWithData.length;

    return {
      students: paginatedStudents,
      hasMore,
      total: studentsWithData.length,
    };
  } catch (error) {
    console.error("Error fetching student feedback data:", error);
    throw error;
  }
}