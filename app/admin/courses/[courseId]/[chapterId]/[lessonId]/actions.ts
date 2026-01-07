"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { lessonSchema, LessonSchemaType, quizSchema,
  questionSchema,
  reorderQuestionsSchema,
  QuizSchemaType,
  QuestionSchemaType,
  ReorderQuestionsSchemaType, feedbackSchema,activitySchema,reorderActivitiesSchema,activityResourceSchema,reorderActivityResourcesSchema, type FeedbackSchemaType,resourceSchema, reorderResourcesSchema, type ResourceSchemaType, type ReorderResourcesSchemaType, type ActivitySchemaType, type ReorderActivitiesSchemaType, type ActivityResourceSchemaType, type ReorderActivityResourcesSchemaType,
  interactiveActivitySchema, reorderInteractiveActivitiesSchema, type InteractiveActivitySchemaType, type ReorderInteractiveActivitiesSchemaType } from "@/lib/zodSchema";

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

// Feedback Actions
export async function createOrUpdateFeedback(
  values: FeedbackSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = feedbackSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: {
        lessonId: lessonId,
      },
    });

    if (existingFeedback) {
      await prisma.feedback.update({
        where: {
          id: existingFeedback.id,
        },
        data: {
          title: result.data.title,
          description: result.data.description,
        },
      });
    } else {
      await prisma.feedback.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          lessonId: lessonId,
        },
      });
    }

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Feedback saved successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to save feedback",
    };
  }
}

export async function deleteFeedback(feedbackId: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    await prisma.feedback.delete({
      where: {
        id: feedbackId,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Feedback deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete feedback",
    };
  }
}

export async function getFeedbackData(lessonId: string) {
  await requireAdmin();

  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        lessonId: lessonId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    return feedback;
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    return null;
  }
}

export async function getResourcesData(lessonId: string) {
  await requireAdmin();

  try {
    const resources = await prisma.resource.findMany({
      where: {
        lessonId: lessonId,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        id: true,
        title: true,
        type: true,
        position: true,
        textContent: true,
        linkUrl: true,
        imageKey: true,
        documentKey: true,
      },
    });

    return resources;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return null;
  }
}

// Create a new resource
export async function createResource(
  values: ResourceSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = resourceSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Validate that required fields for the resource type are present
    if (result.data.type === "TEXT" && !result.data.textContent) {
      return {
        status: "error",
        message: "Text content is required for TEXT resources",
      };
    }
    if (result.data.type === "LINK" && !result.data.linkUrl) {
      return {
        status: "error",
        message: "Link URL is required for LINK resources",
      };
    }
    if (result.data.type === "IMAGE" && !result.data.imageKey) {
      return {
        status: "error",
        message: "Image is required for IMAGE resources",
      };
    }
    if (result.data.type === "DOCUMENT" && !result.data.documentKey) {
      return {
        status: "error",
        message: "Document is required for DOCUMENT resources",
      };
    }

    // Get max position
    const maxPos = await prisma.resource.findFirst({
      where: {
        lessonId: result.data.lessonId,
      },
      select: {
        position: true,
      },
      orderBy: {
        position: 'desc',
      },
    });

    // Create resource
    await prisma.resource.create({
      data: {
        title: result.data.title,
        type: result.data.type,
        lessonId: result.data.lessonId,
        position: (maxPos?.position ?? 0) + 1,
        textContent: result.data.textContent,
        linkUrl: result.data.linkUrl,
        imageKey: result.data.imageKey,
        documentKey: result.data.documentKey,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Resource created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create resource",
    };
  }
}

// Update a resource
export async function updateResource(
  values: ResourceSchemaType,
  resourceId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = resourceSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Validate required fields
    if (result.data.type === "TEXT" && !result.data.textContent) {
      return {
        status: "error",
        message: "Text content is required for TEXT resources",
      };
    }
    if (result.data.type === "LINK" && !result.data.linkUrl) {
      return {
        status: "error",
        message: "Link URL is required for LINK resources",
      };
    }
    if (result.data.type === "IMAGE" && !result.data.imageKey) {
      return {
        status: "error",
        message: "Image is required for IMAGE resources",
      };
    }
    if (result.data.type === "DOCUMENT" && !result.data.documentKey) {
      return {
        status: "error",
        message: "Document is required for DOCUMENT resources",
      };
    }

    await prisma.resource.update({
      where: {
        id: resourceId,
      },
      data: {
        title: result.data.title,
        type: result.data.type,
        textContent: result.data.textContent,
        linkUrl: result.data.linkUrl,
        imageKey: result.data.imageKey,
        documentKey: result.data.documentKey,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Resource updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update resource",
    };
  }
}

// Delete a resource
export async function deleteResource({
  resourceId,
  lessonId,
}: {
  resourceId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const lessonWithResources = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        resources: {
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

    if (!lessonWithResources) {
      return {
        status: 'error',
        message: 'Lesson not found.',
      };
    }

    const resources = lessonWithResources.resources;
    const resourceToDelete = resources.find((r) => r.id === resourceId);

    if (!resourceToDelete) {
      return {
        status: 'error',
        message: 'Resource not found.',
      };
    }

    const remainingResources = resources.filter((r) => r.id !== resourceId);
    const updates = remainingResources.map((resource, index) =>
      prisma.resource.update({
        where: { id: resource.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.resource.delete({
        where: { id: resourceId },
      }),
    ]);

    revalidatePath(`/admin/courses`);
    return {
      status: 'success',
      message: 'Resource deleted successfully.',
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete resource.",
    };
  }
}

// Reorder resources
export async function reorderResources(
  values: ReorderResourcesSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = reorderResourcesSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const updates = result.data.resources.map((resource) =>
      prisma.resource.update({
        where: {
          id: resource.id,
        },
        data: {
          position: resource.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Resources reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder resources",
    };
  }
}

// Interactive Activity Actions
export async function getInteractiveActivitiesData(lessonId: string) {
  await requireAdmin();

  try {
    const activities = await prisma.interactiveActivity.findMany({
      where: {
        lessonId: lessonId,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        documentKey: true,
        position: true,
      },
    });

    return activities;
  } catch (error) {
    console.error("Failed to fetch interactive activities:", error);
    return null;
  }
}

export async function createInteractiveActivity(
  values: InteractiveActivitySchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = interactiveActivitySchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const maxPos = await prisma.interactiveActivity.findFirst({
      where: {
        lessonId: result.data.lessonId,
      },
      select: {
        position: true,
      },
      orderBy: {
        position: 'desc',
      },
    });

    await prisma.interactiveActivity.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        documentKey: result.data.documentKey,
        lessonId: result.data.lessonId,
        position: (maxPos?.position ?? 0) + 1,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Interactive activity created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create interactive activity",
    };
  }
}

export async function updateInteractiveActivity(
  values: InteractiveActivitySchemaType,
  activityId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = interactiveActivitySchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.interactiveActivity.update({
      where: {
        id: activityId,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        documentKey: result.data.documentKey,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Interactive activity updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update interactive activity",
    };
  }
}

export async function deleteInteractiveActivity({
  activityId,
  lessonId,
}: {
  activityId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const lessonWithActivities = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        interactiveActivities: {
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

    if (!lessonWithActivities) {
      return {
        status: 'error',
        message: 'Lesson not found.',
      };
    }

    const activities = lessonWithActivities.interactiveActivities;
    const activityToDelete = activities.find((a) => a.id === activityId);

    if (!activityToDelete) {
      return {
        status: 'error',
        message: 'Interactive activity not found.',
      };
    }

    const remainingActivities = activities.filter((a) => a.id !== activityId);
    const updates = remainingActivities.map((activity, index) =>
      prisma.interactiveActivity.update({
        where: { id: activity.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.interactiveActivity.delete({
        where: { id: activityId },
      }),
    ]);

    revalidatePath(`/admin/courses`);
    return {
      status: 'success',
      message: 'Interactive activity deleted successfully.',
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete interactive activity.",
    };
  }
}

export async function reorderInteractiveActivities(
  values: ReorderInteractiveActivitiesSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = reorderInteractiveActivitiesSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const updates = result.data.interactiveActivities.map((activity) =>
      prisma.interactiveActivity.update({
        where: {
          id: activity.id,
        },
        data: {
          position: activity.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Interactive activities reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder interactive activities",
    };
  }
}
// Activity Actions
export async function createActivity(
  values: ActivitySchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = activitySchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Get max position
    const maxPos = await prisma.activity.findFirst({
      where: {
        lessonId: result.data.lessonId,
      },
      select: {
        position: true,
      },
      orderBy: {
        position: 'desc',
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        title: result.data.title,
        shortDescription: result.data.shortDescription,
        description: result.data.description,
        lessonId: result.data.lessonId,
        position: (maxPos?.position ?? 0) + 1,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Activity created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create activity",
    };
  }
}

export async function updateActivity(
  values: ActivitySchemaType,
  activityId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = activitySchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        title: result.data.title,
        shortDescription: result.data.shortDescription,
        description: result.data.description,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Activity updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update activity",
    };
  }
}

export async function deleteActivity({
  activityId,
  lessonId,
}: {
  activityId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const lessonWithActivities = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        activities: {
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

    if (!lessonWithActivities) {
      return {
        status: 'error',
        message: 'Lesson not found.',
      };
    }

    const activities = lessonWithActivities.activities;
    const activityToDelete = activities.find((a) => a.id === activityId);

    if (!activityToDelete) {
      return {
        status: 'error',
        message: 'Activity not found.',
      };
    }

    const remainingActivities = activities.filter((a) => a.id !== activityId);
    const updates = remainingActivities.map((activity, index) =>
      prisma.activity.update({
        where: { id: activity.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.activity.delete({
        where: { id: activityId },
      }),
    ]);

    revalidatePath(`/admin/courses`);
    return {
      status: 'success',
      message: 'Activity deleted successfully.',
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete activity.",
    };
  }
}

export async function reorderActivities(
  values: ReorderActivitiesSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = reorderActivitiesSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const updates = result.data.activities.map((activity) =>
      prisma.activity.update({
        where: {
          id: activity.id,
        },
        data: {
          position: activity.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Activities reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder activities",
    };
  }
}

// Activity Resource Actions
export async function createActivityResource(
  values: ActivityResourceSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = activityResourceSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Validate required fields for resource type
    if (result.data.type === "TEXT" && !result.data.textContent) {
      return {
        status: "error",
        message: "Text content is required for TEXT resources",
      };
    }
    if (result.data.type === "LINK" && !result.data.linkUrl) {
      return {
        status: "error",
        message: "Link URL is required for LINK resources",
      };
    }
    if (result.data.type === "IMAGE" && !result.data.imageKey) {
      return {
        status: "error",
        message: "Image is required for IMAGE resources",
      };
    }
    if (result.data.type === "DOCUMENT" && !result.data.documentKey) {
      return {
        status: "error",
        message: "Document is required for DOCUMENT resources",
      };
    }

    // Get max position
    const maxPos = await prisma.activityResource.findFirst({
      where: {
        activityId: result.data.activityId,
      },
      select: {
        position: true,
      },
      orderBy: {
        position: 'desc',
      },
    });

    // Create resource
    await prisma.activityResource.create({
      data: {
        title: result.data.title,
        type: result.data.type,
        activityId: result.data.activityId,
        position: (maxPos?.position ?? 0) + 1,
        textContent: result.data.textContent,
        linkUrl: result.data.linkUrl,
        imageKey: result.data.imageKey,
        documentKey: result.data.documentKey,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Resource created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create resource",
    };
  }
}

export async function updateActivityResource(
  values: ActivityResourceSchemaType,
  resourceId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = activityResourceSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Validate required fields
    if (result.data.type === "TEXT" && !result.data.textContent) {
      return {
        status: "error",
        message: "Text content is required for TEXT resources",
      };
    }
    if (result.data.type === "LINK" && !result.data.linkUrl) {
      return {
        status: "error",
        message: "Link URL is required for LINK resources",
      };
    }
    if (result.data.type === "IMAGE" && !result.data.imageKey) {
      return {
        status: "error",
        message: "Image is required for IMAGE resources",
      };
    }
    if (result.data.type === "DOCUMENT" && !result.data.documentKey) {
      return {
        status: "error",
        message: "Document is required for DOCUMENT resources",
      };
    }

    await prisma.activityResource.update({
      where: {
        id: resourceId,
      },
      data: {
        title: result.data.title,
        type: result.data.type,
        textContent: result.data.textContent,
        linkUrl: result.data.linkUrl,
        imageKey: result.data.imageKey,
        documentKey: result.data.documentKey,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Resource updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update resource",
    };
  }
}

export async function deleteActivityResource({
  resourceId,
  activityId,
}: {
  resourceId: string;
  activityId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const activityWithResources = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
      select: {
        resources: {
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

    if (!activityWithResources) {
      return {
        status: 'error',
        message: 'Activity not found.',
      };
    }

    const resources = activityWithResources.resources;
    const resourceToDelete = resources.find((r) => r.id === resourceId);

    if (!resourceToDelete) {
      return {
        status: 'error',
        message: 'Resource not found.',
      };
    }

    const remainingResources = resources.filter((r) => r.id !== resourceId);
    const updates = remainingResources.map((resource, index) =>
      prisma.activityResource.update({
        where: { id: resource.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.activityResource.delete({
        where: { id: resourceId },
      }),
    ]);

    revalidatePath(`/admin/courses`);
    return {
      status: 'success',
      message: 'Resource deleted successfully.',
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete resource.",
    };
  }
}

export async function reorderActivityResources(
  values: ReorderActivityResourcesSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = reorderActivityResourcesSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const updates = result.data.resources.map((resource) =>
      prisma.activityResource.update({
        where: {
          id: resource.id,
        },
        data: {
          position: resource.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Resources reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder resources",
    };
  }
}

export async function getActivitiesData(lessonId: string) {
  await requireAdmin();

  try {
    const activities = await prisma.activity.findMany({
      where: {
        lessonId: lessonId,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        id: true,
        title: true,
        shortDescription: true,
        description: true,
        position: true,
        resources: {
          orderBy: {
            position: 'asc',
          },
          select: {
            id: true,
            title: true,
            type: true,
            position: true,
            textContent: true,
            linkUrl: true,
            imageKey: true,
            documentKey: true,
          },
        },
      },
    });

    return activities;
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return null;
  }
}
export async function getActivityResourcesData(activityId: string) {
  await requireAdmin();

  try {
    const resources = await prisma.activityResource.findMany({
      where: { activityId },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        type: true,
        position: true,
        textContent: true,
        linkUrl: true,
        imageKey: true,
        documentKey: true,
      },
    });

    return resources;
  } catch (error) {
    console.error("Failed to fetch activity resources:", error);
    return null;
  }
}



