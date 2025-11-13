import { describe, it, expect } from 'vitest';
import {
  createQuizSchema,
  createMcqQuestionSchema,
  createShortQuestionSchema,
  createCodeQuestionSchema,
} from '../lib/validation';

describe('Zod Validation Schemas', () => {
  describe('createQuizSchema', () => {
    it('validates a valid quiz', () => {
      const data = {
        title: 'Test Quiz',
        description: 'This is a test quiz description',
        timeLimitSeconds: 300,
        isPublished: false,
      };

      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('requires title and description', () => {
      const data = {
        title: '',
        description: '',
      };

      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires minimum title length', () => {
      const data = {
        title: 'Hi',
        description: 'This is a valid description',
      };

      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires minimum description length', () => {
      const data = {
        title: 'Valid Title',
        description: 'Short',
      };

      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createMcqQuestionSchema', () => {
    it('validates a valid MCQ question', () => {
      const data = {
        prompt: 'What is 2 + 2?',
        options: ['3', '4', '5'],
        correctAnswer: 1,
      };

      const result = createMcqQuestionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('requires at least 2 options', () => {
      const data = {
        prompt: 'What is 2 + 2?',
        options: ['4'],
        correctAnswer: 0,
      };

      const result = createMcqQuestionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires a correct answer', () => {
      const data = {
        prompt: 'What is 2 + 2?',
        options: ['3', '4', '5'],
      };

      const result = createMcqQuestionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createShortQuestionSchema', () => {
    it('validates a valid short question', () => {
      const data = {
        prompt: 'What is the capital of France?',
        correctAnswer: 'Paris',
      };

      const result = createShortQuestionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('requires a prompt', () => {
      const data = {
        prompt: '',
        correctAnswer: 'Answer',
      };

      const result = createShortQuestionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createCodeQuestionSchema', () => {
    it('validates a valid code question', () => {
      const data = {
        prompt: 'Write a function that adds two numbers',
      };

      const result = createCodeQuestionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('requires a prompt', () => {
      const data = {
        prompt: '',
      };

      const result = createCodeQuestionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
