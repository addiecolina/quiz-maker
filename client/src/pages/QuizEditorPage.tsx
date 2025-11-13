import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz, useCreateQuestion, useUpdateQuiz } from "../hooks/useQuizApi";
import { CreateQuestionForm } from "../components/forms/CreateQuestionForm";
import {
  type CreateMcqQuestionFormData,
  type CreateShortQuestionFormData,
  type CreateCodeQuestionFormData,
} from "../lib/validation";

interface QuizEditorPageProps {
  quizId: number;
  onBack: () => void;
}

type CreateQuestionFormData =
  | CreateMcqQuestionFormData
  | CreateShortQuestionFormData
  | CreateCodeQuestionFormData;

export function QuizEditorPage({
  quizId: _quizId,
  onBack: _onBack,
}: QuizEditorPageProps) {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quizId = parseInt(idParam || "0", 10);

  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [questionType, setQuestionType] = useState<"mcq" | "short" | "code">(
    "mcq"
  );

  const { data: quiz, isLoading, error } = useQuiz(quizId);
  const createQuestionMutation = useCreateQuestion(quizId);
  const updateQuizMutation = useUpdateQuiz(quizId);

  const handleCreateQuestion = async (data: CreateQuestionFormData) => {
    const submitData = {
      ...data,
      type: questionType,
    };
    await createQuestionMutation.mutateAsync(submitData);
    setShowCreateQuestion(false);
  };

  const handlePublish = async () => {
    if (!quiz) return;
    await updateQuizMutation.mutateAsync({
      isPublished: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading quiz...
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load quiz
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate("/quizzes")}
            className="text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
        </div>
        <button
          onClick={handlePublish}
          disabled={quiz.isPublished || updateQuizMutation.isPending}
          className={`px-4 py-2 rounded-md text-white transition ${
            quiz.isPublished
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {quiz.isPublished ? "Published" : "Publish Quiz"}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Questions ({quiz.questions.length})
        </h2>
        <button
          onClick={() => setShowCreateQuestion(!showCreateQuestion)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showCreateQuestion ? "Cancel" : "Add Question"}
        </button>
      </div>

      {showCreateQuestion && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) =>
                setQuestionType(e.target.value as "mcq" | "short" | "code")
              }
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="short">Short Answer</option>
              <option value="code">Code</option>
            </select>
          </div>
          <CreateQuestionForm
            questionType={questionType}
            onSubmit={handleCreateQuestion}
            isLoading={createQuestionMutation.isPending}
          />
        </div>
      )}

      <div className="space-y-4">
        {quiz.questions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded">
            <p className="text-gray-500">
              No questions yet. Add your first question!
            </p>
          </div>
        ) : (
          quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Question {index + 1} ({question.type.toUpperCase()})
                  </h3>
                  <p className="text-gray-700 mb-4">{question.prompt}</p>
                  {question.type === "mcq" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded border ${
                            i === question.correctAnswer
                              ? "bg-green-50 border-green-300"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          {i === question.correctAnswer && (
                            <span className="text-green-700 font-semibold">
                              ✓{" "}
                            </span>
                          )}
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  {question.type === "short" && (
                    <div className="p-2 rounded bg-green-50 border border-green-300">
                      <span className="text-green-700 font-semibold">
                        Answer:{" "}
                      </span>
                      {question.correctAnswer}
                    </div>
                  )}
                  {question.type === "code" && (
                    <div className="p-2 rounded bg-green-50 border border-green-300">
                      <span className="text-green-700 font-semibold">
                        Answer:{" "}
                      </span>
                      <pre className="mt-2 p-2 bg-gray-50 rounded font-mono text-sm overflow-auto">
                        {question.correctAnswer}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
