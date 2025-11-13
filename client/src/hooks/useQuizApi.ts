import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api';
import type { Quiz } from '../types';

// Query hooks
export function useQuizzes() {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: () => apiClient.listQuizzes(),
  });
}

export function useQuiz(id: number) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => apiClient.getQuiz(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.createQuiz>[0]) =>
      apiClient.createQuiz(data),
    onSuccess: (newQuiz) => {
      console.log('[Query] useCreateQuiz - Success:', newQuiz);
      // Update quizzes list
      queryClient.setQueryData(['quizzes'], (oldQuizzes: Quiz[] | undefined) => {
        return oldQuizzes ? [newQuiz, ...oldQuizzes] : [newQuiz];
      });
    },
    onError: (error) => {
      console.error('[Query] useCreateQuiz - Error:', error);
    },
  });
}

export function useUpdateQuiz(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.updateQuiz>[1]) =>
      apiClient.updateQuiz(quizId, data),
    onSuccess: () => {
      console.log('[Query] useUpdateQuiz - Success for quiz:', quizId);
      // Invalidate quiz details
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
    },
    onError: (error) => {
      console.error('[Query] useUpdateQuiz - Error for quiz:', quizId, error);
    },
  });
}

export function useCreateQuestion(quizId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.createQuestion>[1]) =>
      apiClient.createQuestion(quizId, data),
    onSuccess: () => {
      console.log('[Query] useCreateQuestion - Success for quiz:', quizId);
      // Invalidate quiz details to refetch with new question
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
    },
    onError: (error) => {
      console.error('[Query] useCreateQuestion - Error for quiz:', quizId, error);
    },
  });
}

export function useUpdateQuestion(questionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.updateQuestion>[1]) =>
      apiClient.updateQuestion(questionId, data),
    onSuccess: () => {
      console.log('[Query] useUpdateQuestion - Success for question:', questionId);
      // Invalidate all quizzes since we don't know which quiz this belongs to
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
    },
    onError: (error) => {
      console.error('[Query] useUpdateQuestion - Error for question:', questionId, error);
    },
  });
}

export function useDeleteQuestion(questionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.deleteQuestion(questionId),
    onSuccess: () => {
      console.log('[Query] useDeleteQuestion - Success for question:', questionId);
      // Invalidate all quizzes
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
    },
    onError: (error) => {
      console.error('[Query] useDeleteQuestion - Error for question:', questionId, error);
    },
  });
}

// Attempt hooks
export function useStartAttempt() {
  return useMutation({
    mutationFn: (quizId: number) => apiClient.startAttempt(quizId),
    onSuccess: (attempt) => {
      console.log('[Query] useStartAttempt - Success:', attempt);
    },
    onError: (error) => {
      console.error('[Query] useStartAttempt - Error:', error);
    },
  });
}

export function useSubmitAnswer(attemptId: number) {
  return useMutation({
    mutationFn: ({
      questionId,
      value,
    }: {
      questionId: number;
      value: string;
    }) => apiClient.submitAnswer(attemptId, questionId, value),
    onSuccess: () => {
      console.log('[Query] useSubmitAnswer - Success for attempt:', attemptId);
    },
    onError: (error) => {
      console.error('[Query] useSubmitAnswer - Error for attempt:', attemptId, error);
    },
  });
}

export function useSubmitAttempt() {
  return useMutation({
    mutationFn: (attemptId: number) => apiClient.submitAttempt(attemptId),
    onSuccess: (result) => {
      console.log('[Query] useSubmitAttempt - Success:', result);
    },
    onError: (error) => {
      console.error('[Query] useSubmitAttempt - Error:', error);
    },
  });
}

export function useTrackEvent(attemptId: number) {
  return useMutation({
    mutationFn: (event: string) => apiClient.trackEvent(attemptId, event),
    onSuccess: () => {
      console.log('[Query] useTrackEvent - Success for attempt:', attemptId);
    },
    onError: (error) => {
      console.error('[Query] useTrackEvent - Error for attempt:', attemptId, error);
    },
  });
}
