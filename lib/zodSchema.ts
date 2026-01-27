import {z} from 'zod'
export const courseLevels=['Beginner','Intermediate','Advanced'] as const;
export const courseStatus =['Draft','Published','Archived'] as const;
export const courseCategories=["Climate Science Basics",
  "Renewable Energy Technologies",
  "Energy Efficiency & Conservation",
  "Sustainable Development Practices",
  "Environmental Policy & Governance",
  "Carbon Footprint & Emissions",
  "Green Innovations & Technology",
  "Disaster Preparedness & Resilience",
  "Ecological Sustainability",
  "Global & Local Climate Challenges",
  "STEM for Sustainability",
  "Community Action & Awareness"] as const;
export const userRoles = ["Admin", "Student", "user"] as const;
export const assessmentSectionTypes = ["KNOWLEDGE", "ATTITUDE", "BEHAVIOUR"] as const;
export const resourceTypes = ["TEXT", "LINK", "IMAGE", "DOCUMENT"] as const;
export const courseSchema= z.object({
    title: z.string().min(3,{message:"Title must be at least 3 characters long"}).max(100,{message:"Title must be under 100 characters"}),
    description: z.string().min(10,{message:"Description must be at least 10 characters long"}),
    fileKey: z.string().min(1,{message:"File key is required"}),
    price: z.coerce.number<number>().optional(),
    duration: z.coerce.number<number>().min(1,{message:"Duration must be at least 1 hour"}).max(500,{message:"Duration must be under 500 hours"}),
    level: z.enum(courseLevels,{message:"Level is required"}),
    category: z.enum(courseCategories,{message:"Category is required"}),
    smallDescription: z.string().min(3,{message:"Small description must be at least 3 characters long"}).max(200,{message:"Small description must be under 200 characters"}),
    slug: z.string().min(3,{message:"Slug must be at least 3 characters long"}),
    status: z.enum(courseStatus,{message:"Status is required"}),

    

});
export const chapterSchema = z.object({
   name: z.string().min(3,{message:"Name must be at least 3 characters long"}),
   courseId: z.string().uuid({message:"Invalid course id"}),
});
export const chapterDetailsSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }).optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type ChapterDetailsSchemaType = z.infer<typeof chapterDetailsSchema>;
export const lessonSchema = z.object({
    name: z.string().min(3,{message:"Name must be at least 3 characters long"}),
    courseId: z.string().uuid({message:"Invalid course id"}),
    chapterId: z.string().uuid({message:"Invalid chapter id"}),
    description: z.string().min(10,{message:"Description must be at least 10 characters long"}).optional(),
    videoKey: z.string().optional(),
    thumbnailKey: z.string().optional(),   
    documentKey: z.string().optional(),
});

export const userRoleSchema = z.enum(userRoles, {
  message: "Invalid user role",
});

export const quizSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  lessonId: z.string().uuid({message: "Invalid lesson id"}),
});

export const questionSchema = z.object({
  text: z.string().min(5, {message: "Question must be at least 5 characters long"}),
  quizId: z.string().uuid({message: "Invalid quiz id"}),
  options: z.array(z.object({
    text: z.string().min(1, {message: "Option text is required"}),
    isCorrect: z.boolean(),
  })).min(2, {message: "At least 2 options are required"})
    .max(6, {message: "Maximum 6 options allowed"}),
});

export const reorderQuestionsSchema = z.object({
  quizId: z.string().uuid(),
  questions: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
  })),
});

export const submitQuizAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedOptionId: z.string().uuid(),
});

export const assessmentSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  description: z.string().optional(),
  courseId: z.string().uuid({message: "Invalid course id"}),
  
});

export const assessmentSectionSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  type: z.enum(assessmentSectionTypes, {message: "Section type is required"}),
  assessmentId: z.string().uuid({message: "Invalid assessment id"}),
});

export const assessmentQuestionSchema = z.object({
  text: z.string().min(5, {message: "Question must be at least 5 characters long"}),
  sectionId: z.string().uuid({message: "Invalid section id"}),
  options: z.array(z.object({
    text: z.string().min(1, {message: "Option text is required"}),
    isCorrect: z.boolean().optional(), // Only for KNOWLEDGE type
  })).min(2, {message: "At least 2 options are required"})
    .max(6, {message: "Maximum 6 options allowed"}),
});

export const reorderAssessmentQuestionsSchema = z.object({
  sectionId: z.string().uuid(),
  questions: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
  })),
});

export const submitAssessmentAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedOptionId: z.string().uuid(),
});

export const submitAssessmentSchema = z.object({
  assessmentId: z.string().uuid(),
  answers: z.array(submitAssessmentAnswerSchema),
});

export const feedbackSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  description: z.string().optional(),
  lessonId: z.string().uuid({message: "Invalid lesson id"}),
});

export const feedbackSubmissionSchema = z.object({
  feedbackId: z.string().uuid({message: "Invalid feedback id"}),
  content: z.string().min(10, {message: "Feedback must be at least 10 characters long"}).max(5000, {message: "Feedback must be under 5000 characters"}),
});

export const resourceSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  type: z.enum(resourceTypes, {message: "Resource type is required"}),
  lessonId: z.string().uuid({message: "Invalid lesson id"}),
  textContent: z.string().optional(),
  linkUrl: z.string().url({message: "Invalid URL"}).optional(),
  imageKey: z.string().optional(),
  documentKey: z.string().optional(),
});

export const reorderResourcesSchema = z.object({
  lessonId: z.string().uuid(),
  resources: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
  })),
});
export const activitySchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  shortDescription: z.string().max(200, {message: "Short description must be under 200 characters"}).optional(),
  description: z.string().min(10, {message: "Description must be at least 10 characters long"}),
  lessonId: z.string().uuid({message: "Invalid lesson id"}),
});

export const activityResourceSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  type: z.enum(resourceTypes, {message: "Resource type is required"}),
  activityId: z.string().uuid({message: "Invalid activity id"}),
  textContent: z.string().optional(),
  linkUrl: z.string().url({message: "Invalid URL"}).optional(),
  imageKey: z.string().optional(),
  documentKey: z.string().optional(),
});

export const reorderActivitiesSchema = z.object({
  lessonId: z.string().uuid(),
  activities: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
  })),
});

export const reorderActivityResourcesSchema = z.object({
  activityId: z.string().uuid(),
  resources: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
  })),
});

export type ActivitySchemaType = z.infer<typeof activitySchema>;
export type ActivityResourceSchemaType = z.infer<typeof activityResourceSchema>;
export type ReorderActivitiesSchemaType = z.infer<typeof reorderActivitiesSchema>;
export type ReorderActivityResourcesSchemaType = z.infer<typeof reorderActivityResourcesSchema>;

export const interactiveActivitySchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  description: z.string().max(200, {message: "Description must be under 200 characters"}).optional(),
  lessonId: z.string().uuid({message: "Invalid lesson id"}),
  documentKey: z.string().min(1, {message: "Document is required"}),
});

export const reorderInteractiveActivitiesSchema = z.object({
  lessonId: z.string().uuid(),
  interactiveActivities: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
  })),
});
export const interactiveActivityResourceSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
  type: z.enum(resourceTypes, {message: "Resource type is required"}),
  interactiveActivityId: z.string().uuid({message: "Invalid interactive activity id"}),
  textContent: z.string().optional(),
  linkUrl: z.string().url({message: "Invalid URL"}).optional(),
  imageKey: z.string().optional(),
  documentKey: z.string().optional(),
});

export const reorderInteractiveActivityResourcesSchema = z.object({
  interactiveActivityId: z.string().uuid(),
  resources: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
  })),
});


export type InteractiveActivitySchemaType = z.infer<typeof interactiveActivitySchema>;
export type ReorderInteractiveActivitiesSchemaType = z.infer<typeof reorderInteractiveActivitiesSchema>;
export type InteractiveActivityResourceSchemaType = z.infer<typeof interactiveActivityResourceSchema>;
export type ReorderInteractiveActivityResourcesSchemaType = z.infer<typeof reorderInteractiveActivityResourcesSchema>;

export type ResourceSchemaType = z.infer<typeof resourceSchema>;
export type ReorderResourcesSchemaType = z.infer<typeof reorderResourcesSchema>;
export type ResourceType = (typeof resourceTypes)[number];

export type FeedbackSchemaType = z.infer<typeof feedbackSchema>;
export type FeedbackSubmissionSchemaType = z.infer<typeof feedbackSubmissionSchema>;

export type AssessmentSchemaType = z.infer<typeof assessmentSchema>;
export type AssessmentSectionSchemaType = z.infer<typeof assessmentSectionSchema>;
export type AssessmentQuestionSchemaType = z.infer<typeof assessmentQuestionSchema>;
export type ReorderAssessmentQuestionsSchemaType = z.infer<typeof reorderAssessmentQuestionsSchema>;
export type SubmitAssessmentAnswerSchemaType = z.infer<typeof submitAssessmentAnswerSchema>;
export type SubmitAssessmentSchemaType = z.infer<typeof submitAssessmentSchema>;

export type QuizSchemaType = z.infer<typeof quizSchema>;
export type QuestionSchemaType = z.infer<typeof questionSchema>;
export type ReorderQuestionsSchemaType = z.infer<typeof reorderQuestionsSchema>;
export type SubmitQuizAnswerSchemaType = z.infer<typeof submitQuizAnswerSchema>;



export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type UserRole = (typeof userRoles)[number]; // "Admin" | "Student" | "user"