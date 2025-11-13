import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();
  const [quizIdInput, setQuizIdInput] = useState("");
  const [error, setError] = useState("");

  const handleTakeQuiz = () => {
    const id = quizIdInput.trim();
    if (!id) {
      setError("Please enter a quiz ID");
      return;
    }

    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
      setError("Quiz ID must be a positive number");
      return;
    }

    setError("");
    navigate(`/attempt/${numId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTakeQuiz();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Quiz Maker</h1>
          <p className="text-xl text-gray-600">
            Create quizzes or test your knowledge
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Create Quiz Option */}
          <div
            onClick={() => navigate("/quizzes")}
            className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow hover:border-blue-500 border-2 border-transparent"
          >
            <div className="text-4xl mb-4">✏️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Create a Quiz
            </h2>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Get Started
            </button>
          </div>

          {/* Take Quiz Option */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-green-500">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Take a Quiz
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a quiz ID to get started.
            </p>

            {/* Input Section */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz ID
                </label>
                <input
                  type="text"
                  placeholder="Enter quiz ID"
                  value={quizIdInput}
                  onChange={(e) => {
                    setQuizIdInput(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}

              <button
                onClick={handleTakeQuiz}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
