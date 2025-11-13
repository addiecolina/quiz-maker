import axios, { AxiosInstance } from 'axios';
import type {
  Quiz,
  QuizWithQuestions,
  Question,
  Attempt,
  SubmitAttemptResult,
  CreateQuizRequest,
  UpdateQuizRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from './types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:4000';
const API_TOKEN = (import.meta.env.VITE_API_TOKEN as string | undefined) || 'dev-token';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    // Response interceptor for error logging
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.error || error.message || 'Unknown error';
        const status = error.response?.status || 'unknown';
        const url = error.config?.url || 'unknown';
        console.error(`[API Error] ${status} - ${url}:`, message, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Quiz endpoints
  async listQuizzes(): Promise<Quiz[]> {
    try {
      console.log('[API] GET /quizzes');
      const response = await this.client.get<Quiz[]>('/quizzes');
      console.log('[API] GET /quizzes - Success', response.data.length, 'quizzes');
      return response.data;
    } catch (error) {
      console.error('[API] GET /quizzes - Failed:', error);
      throw error;
    }
  }

  async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    try {
      console.log('[API] POST /quizzes', data);
      const response = await this.client.post<Quiz>('/quizzes', data);
      console.log('[API] POST /quizzes - Success', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] POST /quizzes - Failed:', error);
      throw error;
    }
  }

  async getQuiz(id: number): Promise<QuizWithQuestions> {
    try {
      console.log(`[API] GET /quizzes/${id}`);
      const response = await this.client.get<QuizWithQuestions>(`/quizzes/${id}`);
      console.log(`[API] GET /quizzes/${id} - Success`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[API] GET /quizzes/${id} - Failed:`, error);
      throw error;
    }
  }

  async updateQuiz(id: number, data: UpdateQuizRequest): Promise<Quiz> {
    try {
      console.log(`[API] PATCH /quizzes/${id}`, data);
      const response = await this.client.patch<Quiz>(`/quizzes/${id}`, data);
      console.log(`[API] PATCH /quizzes/${id} - Success`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[API] PATCH /quizzes/${id} - Failed:`, error);
      throw error;
    }
  }

  // Question endpoints
  async createQuestion(
    quizId: number,
    data: CreateQuestionRequest,
  ): Promise<Question> {
    try {
      console.log(`[API] POST /quizzes/${quizId}/questions`, data);
      const response = await this.client.post<Question>(
        `/quizzes/${quizId}/questions`,
        data,
      );
      console.log(`[API] POST /quizzes/${quizId}/questions - Success`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[API] POST /quizzes/${quizId}/questions - Failed:`, error);
      throw error;
    }
  }

  async updateQuestion(id: number, data: UpdateQuestionRequest): Promise<Question> {
    try {
      console.log(`[API] PATCH /questions/${id}`, data);
      const response = await this.client.patch<Question>(`/questions/${id}`, data);
      console.log(`[API] PATCH /questions/${id} - Success`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[API] PATCH /questions/${id} - Failed:`, error);
      throw error;
    }
  }

  async deleteQuestion(id: number): Promise<void> {
    try {
      console.log(`[API] DELETE /questions/${id}`);
      await this.client.delete(`/questions/${id}`);
      console.log(`[API] DELETE /questions/${id} - Success`);
    } catch (error) {
      console.error(`[API] DELETE /questions/${id} - Failed:`, error);
      throw error;
    }
  }

  // Attempt endpoints
  async startAttempt(quizId: number): Promise<Attempt> {
    try {
      console.log('[API] POST /attempts', { quizId });
      const response = await this.client.post<Attempt>('/attempts', { quizId });
      console.log('[API] POST /attempts - Success', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] POST /attempts - Failed:', error);
      throw error;
    }
  }

  async submitAnswer(attemptId: number, questionId: number, value: string): Promise<void> {
    try {
      console.log(`[API] POST /attempts/${attemptId}/answer`, { questionId, value });
      await this.client.post(`/attempts/${attemptId}/answer`, {
        questionId,
        value,
      });
      console.log(`[API] POST /attempts/${attemptId}/answer - Success`);
    } catch (error) {
      console.error(`[API] POST /attempts/${attemptId}/answer - Failed:`, error);
      throw error;
    }
  }

  async submitAttempt(attemptId: number): Promise<SubmitAttemptResult> {
    try {
      console.log(`[API] POST /attempts/${attemptId}/submit`);
      const response = await this.client.post<SubmitAttemptResult>(
        `/attempts/${attemptId}/submit`,
      );
      console.log(`[API] POST /attempts/${attemptId}/submit - Success`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[API] POST /attempts/${attemptId}/submit - Failed:`, error);
      throw error;
    }
  }

  async trackEvent(attemptId: number, event: string): Promise<void> {
    try {
      console.log(`[API] POST /attempts/${attemptId}/events`, { event });
      await this.client.post(`/attempts/${attemptId}/events`, { event });
      console.log(`[API] POST /attempts/${attemptId}/events - Success`);
    } catch (error) {
      console.error(`[API] POST /attempts/${attemptId}/events - Failed:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
