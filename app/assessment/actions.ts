"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export async function submitAssessment(
  assessmentId: string,
  answers: { questionId: string; selectedOptionId: string }[],
  courseId: string
): Promise<ApiResponse & { data?: { knowledgeScore: number; knowledgeTotal: number; knowledgePercentage: number } }> {
  const session = await requireUser();

  try {
    // Check if already submitted
    const existingSubmission = await prisma.assessmentSubmission.findUnique({
      where: {
        userId_assessmentId: {
          userId: session.user.id,
          assessmentId: assessmentId,
        },
      },
    });

    if (existingSubmission) {
      return {
        status: "error",
        message: "You have already submitted this assessment",
      };
    }

    // Verify assessment belongs to the course
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: assessmentId,
        courseId: courseId,
      },
      select: {
        sections: {
          select: {
            id: true,
            type: true,
            questions: {
              select: {
                id: true,
                options: {
                  select: {
                    id: true,
                    isCorrect: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      return {
        status: "error",
        message: "Assessment not found for this course",
      };
    }

    // Validate all questions are answered
    const allQuestions = assessment.sections.flatMap(s => s.questions);
    if (answers.length !== allQuestions.length) {
      return {
        status: "error",
        message: "Please answer all questions before submitting",
      };
    }

    // Calculate knowledge score
    let knowledgeScore = 0;
    let knowledgeTotal = 0;

    await prisma.$transaction(async (tx) => {
      for (const answer of answers) {
        const question = allQuestions.find(q => q.id === answer.questionId);
        if (!question) continue;

        // Find the section type for this question
        const section = assessment.sections.find(s =>
          s.questions.some(q => q.id === answer.questionId)
        );

        const option = question.options.find(o => o.id === answer.selectedOptionId);

        // Only count knowledge questions for scoring
        if (section?.type === "KNOWLEDGE") {
          knowledgeTotal++;
          if (option?.isCorrect) {
            knowledgeScore++;
          }
        }

        // Save answer
        await tx.userAssessmentAnswer.upsert({
          where: {
            userId_questionId: {
              userId: session.user.id,
              questionId: answer.questionId,
            },
          },
          create: {
            userId: session.user.id,
            questionId: answer.questionId,
            selectedOptionId: answer.selectedOptionId,
          },
          update: {
            selectedOptionId: answer.selectedOptionId,
          },
        });
      }

      // Calculate percentage
      const knowledgePercentage = knowledgeTotal > 0
        ? Math.round((knowledgeScore / knowledgeTotal) * 100)
        : 0;

      // Save submission
      await tx.assessmentSubmission.create({
        data: {
          userId: session.user.id,
          assessmentId: assessmentId,
          knowledgeScore: knowledgeScore,
          knowledgeTotal: knowledgeTotal,
          knowledgePercentage: knowledgePercentage,
          completed: true,
        },
      });

      // Create enrollment
      await tx.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: courseId,
          status: "Completed",
        },
      });
    });

    const knowledgePercentage = knowledgeTotal > 0
      ? Math.round((knowledgeScore / knowledgeTotal) * 100)
      : 0;

    revalidatePath("/assessment");
    revalidatePath("/dashboard");
    return {
      status: "success",
      message: "Assessment submitted successfully!",
      data: {
        knowledgeScore,
        knowledgeTotal,
        knowledgePercentage,
      },
    };
  } catch (error) {
    console.error("Submit assessment error:", error);
    return {
      status: "error",
      message: "Failed to submit assessment",
    };
  }
}