import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizzes, useCreateQuiz } from "../hooks/useQuizApi";
import { CreateQuizForm } from "../components/forms/CreateQuizForm";
import { type CreateQuizFormData } from "../lib/validation";

interface QuizzesPageProps {
  onSelectQuiz?: (quizId: number) => void;
}

export function QuizzesPage({}: QuizzesPageProps) {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: quizzes, isLoading, error } = useQuizzes();
  const createQuizMutation = useCreateQuiz();

  const handleCreateQuiz = async (data: CreateQuizFormData) => {
    try {
      // Filter out empty string from timeLimitSeconds
      const submitData = {
        ...data,
        timeLimitSeconds:
          data.timeLimitSeconds === "" ? undefined : data.timeLimitSeconds,
      };
      console.log("[QuizzesPage] Creating quiz:", submitData);
      await createQuizMutation.mutateAsync(submitData);
      console.log("[QuizzesPage] Quiz created successfully");
      setShowCreateForm(false);
    } catch (err) {
      console.error("[QuizzesPage] Error creating quiz:", err);
      // Error is handled by the mutation's onError callback
    }
  };

  const handleSelectQuiz = (quizId: number) => {
    console.log("[QuizzesPage] Selecting quiz:", quizId);
    navigate(`/editor/${quizId}`);
  };

  if (isLoading) {
    console.log("[QuizzesPage] Loading quizzes...");
    return (
      <div className="flex items-center justify-center p-8">
        Loading quizzes...
      </div>
    );
  }

  if (error) {
    console.error("[QuizzesPage] Error loading quizzes:", error);
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-semibold">Failed to load quizzes</p>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showCreateForm ? "Cancel" : "Create Quiz"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
          <CreateQuizForm
            onSubmit={handleCreateQuiz}
            isLoading={createQuizMutation.isPending}
          />
        </div>
      )}

      {!quizzes || quizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No quizzes yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    quiz.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {quiz.isPublished ? "Published" : "Draft"}
                </span>
                <button
                  onClick={() => handleSelectQuiz(quiz.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
