/**
 * Types representing the Quiz Maker API data structures
 */

export type QuestionType = 'mcq' | 'short' | 'code';

export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimitSeconds?: number;
  isPublished: boolean;
  createdAt: string;
}

export interface Question {
  id: number;
  quizId: number;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer?: number | string;
  position: number;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

export interface AttemptAnswer {
  questionId: number;
  value: string;
}

export interface Attempt {
  id: number;
  quizId: number;
  startedAt: string;
  submittedAt?: string;
  answers: AttemptAnswer[];
  score?: number;
  quiz?: {
    id: number;
    title: string;
    description: string;
    timeLimitSeconds?: number;
    questions: Question[];
  };
}

export interface SubmitAttemptResult {
  score: number;
  details: Array<{
    questionId: number;
    correct: boolean;
    expected?: string;
  }>;
}

export interface ApiError {
  error: string;
}

// Request/Response DTOs
export interface CreateQuizRequest {
  title: string;
  description: string;
  timeLimitSeconds?: number;
  isPublished?: boolean;
}

export interface UpdateQuizRequest {
  title?: string;
  description?: string;
  timeLimitSeconds?: number;
  isPublished?: boolean;
}

export interface CreateQuestionRequest {
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer?: number | string;
  position?: number;
}

export interface UpdateQuestionRequest {
  type?: QuestionType;
  prompt?: string;
  options?: string[] | null;
  correctAnswer?: number | string;
  position?: number;
}
