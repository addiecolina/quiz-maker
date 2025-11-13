import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { queryClient } from "./lib/queryClient";
import { LandingPage } from "./pages/LandingPage";
import { QuizzesPage } from "./pages/QuizzesPage";
import { QuizEditorPage } from "./pages/QuizEditorPage";
import { QuizAttemptPage } from "./pages/QuizAttemptPage";
import "./index.css";

function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Quiz Maker
          </Link>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Home
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/quizzes"
            element={<QuizzesPage onSelectQuiz={() => {}} />}
          />
          <Route
            path="/editor/:id"
            element={<QuizEditorPage quizId={0} onBack={() => {}} />}
          />
          <Route
            path="/attempt/:id"
            element={<QuizAttemptPage quizId={0} onBack={() => {}} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
