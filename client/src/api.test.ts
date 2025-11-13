import { describe, it, expect, vi } from 'vitest';
import { apiClient } from './api';

// Mock axios
vi.mock('axios');

describe('API Client', () => {
  describe('Quiz endpoints', () => {
    it('should have listQuizzes method', () => {
      expect(typeof apiClient.listQuizzes).toBe('function');
    });

    it('should have createQuiz method', () => {
      expect(typeof apiClient.createQuiz).toBe('function');
    });

    it('should have getQuiz method', () => {
      expect(typeof apiClient.getQuiz).toBe('function');
    });

    it('should have updateQuiz method', () => {
      expect(typeof apiClient.updateQuiz).toBe('function');
    });
  });

  describe('Question endpoints', () => {
    it('should have createQuestion method', () => {
      expect(typeof apiClient.createQuestion).toBe('function');
    });

    it('should have updateQuestion method', () => {
      expect(typeof apiClient.updateQuestion).toBe('function');
    });

    it('should have deleteQuestion method', () => {
      expect(typeof apiClient.deleteQuestion).toBe('function');
    });
  });

  describe('Attempt endpoints', () => {
    it('should have startAttempt method', () => {
      expect(typeof apiClient.startAttempt).toBe('function');
    });

    it('should have submitAnswer method', () => {
      expect(typeof apiClient.submitAnswer).toBe('function');
    });

    it('should have submitAttempt method', () => {
      expect(typeof apiClient.submitAttempt).toBe('function');
    });

    it('should have trackEvent method', () => {
      expect(typeof apiClient.trackEvent).toBe('function');
    });
  });
});
