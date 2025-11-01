"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { lessonSchema, LessonSchemaType, quizSchema,
  questionSchema,
  reorderQuestionsSchema,
  QuizSchemaType,
  QuestionSchemaType,
  ReorderQuestionsSchemaType, } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

export async function updateLesson(values: LessonSchemaType, lessonId: string): Promise<ApiResponse>{
    await requireAdmin()

    try {
       const result = lessonSchema.safeParse(values);

       if(!result.success) {
        return {
            status:"error",
            message:"Invalid data",
        };
       }

       await prisma.lesson.update({
        where:{
            id: lessonId,
        },
        data:{
            title: result.data.name,
            videoKey: result.data.videoKey,
            thumbnailKey: result.data.thumbnailKey,
            description: result.data.description,
            documentKey: result.data.documentKey,
        },
       });
       
       return {
        status: "success",
        message: "Course updated successfully",
       };
    } catch {
      return {
        status: "error",
        message: "Failed to update course",
      };
    }
}

//quiz starts from here
export async function createOrUpdateQuiz(
  values: QuizSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = quizSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Check if quiz already exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: {
        lessonId: lessonId,
      },
    });

    if (existingQuiz) {
      await prisma.quiz.update({
        where: {
          id: existingQuiz.id,
        },
        data: {
          title: result.data.title,
        },
      });
    } else {
      await prisma.quiz.create({
        data: {
          title: result.data.title,
          lessonId: lessonId,
          position: 1,
        },
      });
    }

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Quiz saved successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to save quiz",
    };
  }
}

export async function createQuestion(
  values: QuestionSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = questionSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Validate that at least one option is correct
    const hasCorrectAnswer = result.data.options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      return {
        status: "error",
        message: "At least one option must be marked as correct",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Get max position
      const maxPos = await tx.question.findFirst({
        where: {
          quizId: result.data.quizId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: 'desc',
        },
      });

      // Create question
      const question = await tx.question.create({
        data: {
          text: result.data.text,
          quizId: result.data.quizId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });

      // Create options
      const optionPromises = result.data.options.map((option, index) =>
        tx.questionOption.create({
          data: {
            text: option.text,
            isCorrect: option.isCorrect,
            position: index + 1,
            questionId: question.id,
          },
        })
      );

      await Promise.all(optionPromises);
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Question created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create question",
    };
  }
}

export async function updateQuestion(
  values: QuestionSchemaType,
  questionId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = questionSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const hasCorrectAnswer = result.data.options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      return {
        status: "error",
        message: "At least one option must be marked as correct",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Update question text
      await tx.question.update({
        where: {
          id: questionId,
        },
        data: {
          text: result.data.text,
        },
      });

      // Delete existing options
      await tx.questionOption.deleteMany({
        where: {
          questionId: questionId,
        },
      });

      // Create new options
      const optionPromises = result.data.options.map((option, index) =>
        tx.questionOption.create({
          data: {
            text: option.text,
            isCorrect: option.isCorrect,
            position: index + 1,
            questionId: questionId,
          },
        })
      );

      await Promise.all(optionPromises);
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Question updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update question",
    };
  }
}

export async function reorderQuestions(
  values: ReorderQuestionsSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = reorderQuestionsSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const updates = result.data.questions.map((question) =>
      prisma.question.update({
        where: {
          id: question.id,
        },
        data: {
          position: question.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Questions reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder questions",
    };
  }
}

export async function deleteQuestion({
  questionId,
  quizId,
}: {
  questionId: string;
  quizId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const quizWithQuestions = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        questions: {
          orderBy: {
            position: 'asc',
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!quizWithQuestions) {
      return {
        status: 'error',
        message: 'Quiz not found.',
      };
    }

    const questions = quizWithQuestions.questions;
    const questionToDelete = questions.find((q) => q.id === questionId);

    if (!questionToDelete) {
      return {
        status: 'error',
        message: 'Question not found.',
      };
    }

    const remainingQuestions = questions.filter((q) => q.id !== questionId);
    const updates = remainingQuestions.map((question, index) =>
      prisma.question.update({
        where: { id: question.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.question.delete({
        where: { id: questionId },
      }),
    ]);

    revalidatePath(`/admin/courses`);
    return {
      status: 'success',
      message: 'Question deleted successfully.',
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete question.",
    };
  }
}

export async function deleteQuiz(quizId: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    await prisma.quiz.delete({
      where: {
        id: quizId,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Quiz deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete quiz",
    };
  }
}

export async function getQuizData(lessonId: string) {
  await requireAdmin();

  try {
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

    return quiz;
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    return null;
  }
}

