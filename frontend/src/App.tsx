import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Nav from "./components/Nav";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AuthModal from "./components/AuthModal";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Nav />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/quiz/:quiz_id" element={<QuizPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Route>
        </Routes>
      </main>

      <AuthModal />
    </div>
  );
}

export default App;
