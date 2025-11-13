import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useStartAttempt,
  useSubmitAnswer,
  useSubmitAttempt,
} from "../hooks/useQuizApi";
import { type Question } from "../types";

interface QuizAttemptPageProps {
  quizId: number;
  onBack: () => void;
}

export function QuizAttemptPage({
  quizId: _quizId,
  onBack: _onBack,
}: QuizAttemptPageProps) {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quizId = parseInt(idParam || "0", 10);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const startAttemptMutation = useStartAttempt();
  const submitAnswerMutation = useSubmitAnswer(
    startAttemptMutation.data?.id || 0
  );
  const submitAttemptMutation = useSubmitAttempt();

  const [attempt, setAttempt] = useState(startAttemptMutation.data);

  useEffect(() => {
    const start = async () => {
      try {
        console.log("[QuizAttemptPage] Starting attempt for quiz:", quizId);
        const att = await startAttemptMutation.mutateAsync(quizId);
        setAttempt(att);
        console.log("[QuizAttemptPage] Attempt started:", att);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to start attempt";
        console.error("[QuizAttemptPage] Error starting attempt:", err);
        setError(errorMsg);
      }
    };
    start();
  }, [quizId]);

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error starting quiz</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex items-center justify-center p-8">
        Starting attempt...
      </div>
    );
  }

  const currentQuestion = attempt.quiz?.questions[currentQuestionIndex];
  if (!currentQuestion) {
    console.error(
      "[QuizAttemptPage] Question not found at index:",
      currentQuestionIndex
    );
    return <div>Question not found</div>;
  }

  const handleAnswerSubmit = async (answer: string) => {
    try {
      console.log("[QuizAttemptPage] Submitting answer:", {
        questionId: currentQuestion.id,
        value: answer,
      });
      await submitAnswerMutation.mutateAsync({
        questionId: currentQuestion.id,
        value: answer,
      });

      // Update local state
      const existingAnswer = attempt.answers.find(
        (a) => a.questionId === currentQuestion.id
      );
      if (existingAnswer) {
        existingAnswer.value = answer;
      } else {
        attempt.answers.push({ questionId: currentQuestion.id, value: answer });
      }

      // Check if this is the last question and it's MCQ
      const isLastQuestion =
        currentQuestionIndex === attempt.quiz!.questions.length - 1;
      const isLastQuestionMcq = currentQuestion.type === "mcq";

      if (isLastQuestion && isLastQuestionMcq) {
        // Auto-submit the quiz
        console.log(
          "[QuizAttemptPage] Auto-submitting quiz for last MCQ question"
        );
        const result = await submitAttemptMutation.mutateAsync(attempt.id);
        setResult(result);
        setSubmitted(true);
      } else if (currentQuestionIndex < attempt.quiz!.questions.length - 1) {
        // Move to next question
        console.log(
          "[QuizAttemptPage] Moving to next question:",
          currentQuestionIndex + 1
        );
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit answer";
      console.error("[QuizAttemptPage] Error submitting answer:", err);
      setError(errorMsg);
    }
  };

  const handleSubmitAttempt = async () => {
    try {
      console.log("[QuizAttemptPage] Submitting attempt:", attempt.id);
      const result = await submitAttemptMutation.mutateAsync(attempt.id);
      console.log("[QuizAttemptPage] Attempt submitted successfully:", result);
      setResult(result);
      setSubmitted(true);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit quiz";
      console.error("[QuizAttemptPage] Error submitting attempt:", err);
      setError(errorMsg);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back
        </button>
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
          <p className="text-lg mb-4">
            Your Score:{" "}
            <span className="font-bold text-2xl">{result.score}</span> /{" "}
            {attempt.quiz?.questions.length}
          </p>
          <div className="space-y-4">
            {result.details.map((detail: any) => {
              const question = attempt.quiz!.questions.find(
                (q) => q.id === detail.questionId
              );
              return (
                <div
                  key={detail.questionId}
                  className={`p-4 rounded border-l-4 ${
                    detail.correct
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <p className="font-semibold">{question?.prompt}</p>
                  <p
                    className={`text-sm mt-2 ${
                      detail.correct ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {detail.correct ? "✓ Correct" : "✗ Incorrect"}
                    {detail.expected && ` - Expected: ${detail.expected}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="text-blue-600 hover:text-blue-700"
      >
        ← Back
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{attempt.quiz?.title}</h1>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of{" "}
            {attempt.quiz?.questions.length}
          </div>
        </div>
        <div className="mb-6 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / attempt.quiz!.questions.length) *
                100
              }%`,
            }}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.prompt}
          </h2>
          <QuestionAnswerForm
            key={currentQuestion.id}
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            isLoading={submitAnswerMutation.isPending}
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 transition"
          >
            Previous
          </button>
          {currentQuestionIndex === attempt.quiz!.questions.length - 1 ? (
            <button
              onClick={handleSubmitAttempt}
              disabled={submitAttemptMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {submitAttemptMutation.isPending
                ? "Submitting..."
                : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface QuestionAnswerFormProps {
  question: Question;
  onSubmit: (answer: string) => Promise<void>;
  isLoading: boolean;
}

function QuestionAnswerForm({
  question,
  onSubmit,
  isLoading,
}: QuestionAnswerFormProps) {
  const [answer, setAnswer] = useState("");

  const handleQuickSubmit = (value: string) => {
    setAnswer(value);
    onSubmit(value);
  };

  if (question.type === "mcq") {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleQuickSubmit(String(index))}
            disabled={isLoading}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "short") {
    return (
      <div className="space-y-4">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => onSubmit(answer)}
          disabled={isLoading || !answer.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Submit Answer
        </button>
      </div>
    );
  }

  if (question.type === "code") {
    return (
      <div className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your code here"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={8}
        />
        <button
          onClick={() => onSubmit(answer)}
          disabled={isLoading || !answer.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Submit Answer
        </button>
      </div>
    );
  }

  return null;
}
