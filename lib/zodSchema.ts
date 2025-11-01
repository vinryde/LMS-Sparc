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
export const courseSchema= z.object({
    title: z.string().min(3,{message:"Title must be at least 3 characters long"}).max(100,{message:"Title must be under 100 characters"}),
    description: z.string().min(10,{message:"Description must be at least 10 characters long"}),
    fileKey: z.string().min(1,{message:"File key is required"}),
    price: z.coerce.number<number>().min(1,{message:"Price must be at least 1"}),
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

export type QuizSchemaType = z.infer<typeof quizSchema>;
export type QuestionSchemaType = z.infer<typeof questionSchema>;
export type ReorderQuestionsSchemaType = z.infer<typeof reorderQuestionsSchema>;
export type SubmitQuizAnswerSchemaType = z.infer<typeof submitQuizAnswerSchema>;



export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type UserRole = (typeof userRoles)[number]; // "Admin" | "Student" | "user"

