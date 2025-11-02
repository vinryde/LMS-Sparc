"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import {
  assessmentSchema,
  assessmentSectionSchema,
  assessmentQuestionSchema,
  reorderAssessmentQuestionsSchema,
  AssessmentSchemaType,
  AssessmentSectionSchemaType,
  AssessmentQuestionSchemaType,
  ReorderAssessmentQuestionsSchemaType,
} from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

export async function createOrUpdateAssessment(
  values: AssessmentSchemaType,
  assessmentId?: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = assessmentSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    if (assessmentId) {
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          title: result.data.title,
          description: result.data.description,
          courseId: result.data.courseId, // Add this line
        },
      });
    } else {
      // Check if course already has an assessment
      const existingAssessment = await prisma.assessment.findUnique({
        where: {
          courseId: result.data.courseId,
        },
      });

      if (existingAssessment) {
        return {
          status: "error",
          message: "This course already has an assessment. Please edit the existing one.",
        };
      }

      await prisma.assessment.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          courseId: result.data.courseId,
        },
      });
    }

    revalidatePath("/admin/assessment");
    return {
      status: "success",
      message: assessmentId ? "Assessment updated successfully" : "Assessment created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to save assessment",
    };
  }
}

export async function createAssessmentSection(
  values: AssessmentSectionSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = assessmentSectionSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.assessmentSection.findFirst({
        where: {
          assessmentId: result.data.assessmentId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: 'desc',
        },
      });

      await tx.assessmentSection.create({
        data: {
          title: result.data.title,
          type: result.data.type,
          assessmentId: result.data.assessmentId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath("/admin/assessment");
    return {
      status: "success",
      message: "Section created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create section",
    };
  }
}

export async function createAssessmentQuestion(
  values: AssessmentQuestionSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = assessmentQuestionSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Get section type to validate options
    const section = await prisma.assessmentSection.findUnique({
      where: { id: result.data.sectionId },
      select: { type: true },
    });

    if (!section) {
      return {
        status: "error",
        message: "Section not found",
      };
    }

    // For KNOWLEDGE type, ensure at least one correct answer
    if (section.type === "KNOWLEDGE") {
      const hasCorrectAnswer = result.data.options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        return {
          status: "error",
          message: "At least one option must be marked as correct for knowledge questions",
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.assessmentQuestion.findFirst({
        where: {
          sectionId: result.data.sectionId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: 'desc',
        },
      });

      const question = await tx.assessmentQuestion.create({
        data: {
          text: result.data.text,
          sectionId: result.data.sectionId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });

      const optionPromises = result.data.options.map((option, index) =>
        tx.assessmentQuestionOption.create({
          data: {
            text: option.text,
            isCorrect: section.type === "KNOWLEDGE" ? (option.isCorrect ?? false) : false,
            position: index + 1,
            questionId: question.id,
          },
        })
      );

      await Promise.all(optionPromises);
    });

    revalidatePath("/admin/assessment");
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

export async function updateAssessmentQuestion(
  values: AssessmentQuestionSchemaType,
  questionId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = assessmentQuestionSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Get section type
    const section = await prisma.assessmentSection.findUnique({
      where: { id: result.data.sectionId },
      select: { type: true },
    });

    if (!section) {
      return {
        status: "error",
        message: "Section not found",
      };
    }

    if (section.type === "KNOWLEDGE") {
      const hasCorrectAnswer = result.data.options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        return {
          status: "error",
          message: "At least one option must be marked as correct for knowledge questions",
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.assessmentQuestion.update({
        where: { id: questionId },
        data: {
          text: result.data.text,
        },
      });

      await tx.assessmentQuestionOption.deleteMany({
        where: {
          questionId: questionId,
        },
      });

      const optionPromises = result.data.options.map((option, index) =>
        tx.assessmentQuestionOption.create({
          data: {
            text: option.text,
            isCorrect: section.type === "KNOWLEDGE" ? (option.isCorrect ?? false) : false,
            position: index + 1,
            questionId: questionId,
          },
        })
      );

      await Promise.all(optionPromises);
    });

    revalidatePath("/admin/assessment");
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

export async function deleteAssessmentQuestion({
  questionId,
  sectionId,
}: {
  questionId: string;
  sectionId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const sectionWithQuestions = await prisma.assessmentSection.findUnique({
      where: {
        id: sectionId,
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

    if (!sectionWithQuestions) {
      return {
        status: 'error',
        message: 'Section not found.',
      };
    }

    const questions = sectionWithQuestions.questions;
    const questionToDelete = questions.find((q) => q.id === questionId);

    if (!questionToDelete) {
      return {
        status: 'error',
        message: 'Question not found.',
      };
    }

    const remainingQuestions = questions.filter((q) => q.id !== questionId);
    const updates = remainingQuestions.map((question, index) =>
      prisma.assessmentQuestion.update({
        where: { id: question.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.assessmentQuestion.delete({
        where: { id: questionId },
      }),
    ]);

    revalidatePath("/admin/assessment");
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

export async function reorderAssessmentQuestions(
  values: ReorderAssessmentQuestionsSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = reorderAssessmentQuestionsSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const updates = result.data.questions.map((question) =>
      prisma.assessmentQuestion.update({
        where: {
          id: question.id,
        },
        data: {
          position: question.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath("/admin/assessment");

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

export async function deleteAssessmentSection({
  sectionId,
  assessmentId,
}: {
  sectionId: string;
  assessmentId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const assessmentWithSections = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
      select: {
        sections: {
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

    if (!assessmentWithSections) {
      return {
        status: 'error',
        message: 'Assessment not found.',
      };
    }

    const sections = assessmentWithSections.sections;
    const sectionToDelete = sections.find((s) => s.id === sectionId);

    if (!sectionToDelete) {
      return {
        status: 'error',
        message: 'Section not found.',
      };
    }

    const remainingSections = sections.filter((s) => s.id !== sectionId);
    const updates = remainingSections.map((section, index) =>
      prisma.assessmentSection.update({
        where: { id: section.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.assessmentSection.delete({
        where: { id: sectionId },
      }),
    ]);

    revalidatePath("/admin/assessment");
    return {
      status: 'success',
      message: 'Section deleted successfully.',
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete section.",
    };
  }
}