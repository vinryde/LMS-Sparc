"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { submitQuizAnswerSchema, SubmitQuizAnswerSchemaType } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

export async function submitQuizCompletion(
  quizId: string,
  answers: { questionId: string; selectedOptionId: string }[],
  slug: string
): Promise<ApiResponse & { data?: { score: number; totalQuestions: number; percentage: number } }> {
  const session = await requireUser();

  try {
    // Check if already submitted
    const existingSubmission = await prisma.quizSubmission.findUnique({
      where: {
        userId_quizId: {
          userId: session.user.id,
          quizId: quizId,
        },
      },
    });

    if (existingSubmission) {
      return {
        status: "error",
        message: "You have already submitted this quiz",
      };
    }

    // Get quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
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
    });

    if (!quiz) {
      return {
        status: "error",
        message: "Quiz not found",
      };
    }

    // Validate all questions are answered
    if (answers.length !== quiz.questions.length) {
      return {
        status: "error",
        message: "Please answer all questions before submitting",
      };
    }

    // Calculate score
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    // Save answers and calculate score in a transaction
    await prisma.$transaction(async (tx) => {
      for (const answer of answers) {
        const question = quiz.questions.find((q) => q.id === answer.questionId);
        const option = question?.options.find((o) => o.id === answer.selectedOptionId);

        if (option?.isCorrect) {
          correctCount++;
        }

        // Save individual answer
        await tx.userQuizAnswer.upsert({
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

      // Save submission
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      await tx.quizSubmission.create({
        data: {
          userId: session.user.id,
          quizId: quizId,
          score: correctCount,
          totalQuestions: totalQuestions,
          percentage: percentage,
        },
      });
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    revalidatePath(`/dashboard/${slug}`);
    return {
      status: "success",
      message: "Quiz submitted successfully!",
      data: {
        score: correctCount,
        totalQuestions: totalQuestions,
        percentage: percentage,
      },
    };
  } catch (error) {
    console.error("Submit quiz error:", error);
    return {
      status: "error",
      message: "Failed to submit quiz",
    };
  }
}



export async function markLessonComplete(lessonId:string,slug:string):Promise<ApiResponse>{
    const session= await requireUser();
    try{
        await prisma.lessonProgress.upsert({
            where:{
               userId_lessonId: {
                userId: session.user.id,
                lessonId: lessonId,
                
               },
            },
            update:{
                completed: true,
            },
            create:{
                userId: session.user.id,
                lessonId: lessonId,
                completed: true,
            }
        })
        revalidatePath(`/dashboard/${slug}`);
        return{
            status:"success",
            message:"Progress updated"
        }
    }
    catch{
       return{
        status:"error",
        message:"Failed to mark complete"
       } 
    }

}

export async function submitFeedback(
  feedbackId: string,
  content: string,
  slug: string
): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    // Check if already submitted
    const existingSubmission = await prisma.feedbackSubmission.findUnique({
      where: {
        userId_feedbackId: {
          userId: session.user.id,
          feedbackId: feedbackId,
        },
      },
    });

    if (existingSubmission) {
      return {
        status: "error",
        message: "You have already submitted feedback for this capsule",
      };
    }

    // Create submission
    await prisma.feedbackSubmission.create({
      data: {
        userId: session.user.id,
        feedbackId: feedbackId,
        content: content,
      },
    });

    revalidatePath(`/dashboard/${slug}`);
    return {
      status: "success",
      message: "Thank you for your feedback!",
    };
  } catch (error) {
    console.error("Submit feedback error:", error);
    return {
      status: "error",
      message: "Failed to submit feedback",
    };
  }
}



//quiz
/*export async function submitQuizAnswer(
  values: SubmitQuizAnswerSchemaType,
  slug: string
): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    const result = submitQuizAnswerSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Verify the option belongs to the question
    const option = await prisma.questionOption.findUnique({
      where: {
        id: result.data.selectedOptionId,
      },
      select: {
        questionId: true,
      },
    });

    if (!option || option.questionId !== result.data.questionId) {
      return {
        status: "error",
        message: "Invalid option selected",
      };
    }

    // Upsert the answer
    await prisma.userQuizAnswer.upsert({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: result.data.questionId,
        },
      },
      update: {
        selectedOptionId: result.data.selectedOptionId,
      },
      create: {
        userId: session.user.id,
        questionId: result.data.questionId,
        selectedOptionId: result.data.selectedOptionId,
      },
    });

    revalidatePath(`/dashboard/${slug}`);
    return {
      status: "success",
      message: "Answer submitted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to submit answer",
    };
  }
}

export async function getQuizResults(quizId: string): Promise<{
  status: string;
  message: string;
  data?: {
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
  };
}> {
  const session = await requireUser();

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        questions: {
          select: {
            id: true,
            userAnswers: {
              where: {
                userId: session.user.id,
              },
              select: {
                selectedOption: {
                  select: {
                    isCorrect: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return {
        status: "error",
        message: "Quiz not found",
      };
    }

    const totalQuestions = quiz.questions.length;
    const correctAnswers = quiz.questions.filter(
      (q) => q.userAnswers[0]?.selectedOption.isCorrect
    ).length;
    const percentage = totalQuestions > 0 
      ? Math.round((correctAnswers / totalQuestions) * 100) 
      : 0;

    return {
      status: "success",
      message: "Results fetched",
      data: {
        totalQuestions,
        correctAnswers,
        percentage,
      },
    };
  } catch {
    return {
      status: "error",
      message: "Failed to fetch results",
    };
  }
}*/




