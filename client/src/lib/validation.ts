import { z } from 'zod';

/**
 * Zod validation schemas for form validation
 */

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  timeLimitSeconds: z.coerce.number().int().positive().optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
});

export type CreateQuizFormData = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = createQuizSchema.partial();

export type UpdateQuizFormData = z.infer<typeof updateQuizSchema>;

export const createMcqQuestionSchema = z.object({
  prompt: z.string().min(1, 'Question prompt is required').min(5, 'Prompt must be at least 5 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required').optional(),
  correctAnswer: z.string().refine(val => val !== '', 'Select a correct answer').pipe(z.coerce.number().int().min(0, 'Select a correct answer')),
});

export type CreateMcqQuestionFormData = z.infer<typeof createMcqQuestionSchema>;

export const createShortQuestionSchema = z.object({
  prompt: z.string().min(1, 'Question prompt is required').min(5, 'Prompt must be at least 5 characters'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

export type CreateShortQuestionFormData = z.infer<typeof createShortQuestionSchema>;

export const createCodeQuestionSchema = z.object({
  prompt: z.string().min(1, 'Question prompt is required').min(5, 'Prompt must be at least 5 characters'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

export type CreateCodeQuestionFormData = z.infer<typeof createCodeQuestionSchema>;

export const mcqAnswerSchema = z.object({
  answer: z.string().min(1, 'Please select an answer'),
});

export type McqAnswerFormData = z.infer<typeof mcqAnswerSchema>;

export const shortAnswerSchema = z.object({
  answer: z.string().min(0, 'Answer is required'),
});

export type ShortAnswerFormData = z.infer<typeof shortAnswerSchema>;

export const codeAnswerSchema = z.object({
  answer: z.string().min(1, 'Please enter code'),
});

export type CodeAnswerFormData = z.infer<typeof codeAnswerSchema>;
