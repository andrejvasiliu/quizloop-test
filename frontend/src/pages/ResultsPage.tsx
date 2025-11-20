import { useLocation, useNavigate } from "react-router-dom";
import type { ResultsState } from "../types/quiz_types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState;

  if (!state) {
    return <div>No results found. Please take a quiz first.</div>;
  }

  const { quizTitle, questions, answers } = state;

  const score = answers.reduce((acc, answerIndex, i) => {
    return acc + (answerIndex === questions[i].answer_index ? 1 : 0);
  }, 0);

  return (
    <>
      <h1>{quizTitle} – Results</h1>
      <p>
        You scored {score} out of {questions.length}
      </p>
      <h2>Review</h2>
      <div>
        {questions.map((question, index) => {
          const correctIndex = question.answer_index;
          const userIndex = answers[index];
          return (
            <Card>
              <CardHeader>
                <CardTitle>{question.question}</CardTitle>
              </CardHeader>
              <CardContent>
                Your answer: {question.answers[userIndex]}{" "}
                {userIndex === correctIndex ? "✅" : "❌"}
                {userIndex !== correctIndex && (
                  <p>Correct answer: {question.answers[correctIndex]}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Button onClick={() => navigate("/")}>Back to Home</Button>
    </>
  );
}

export default ResultsPage;
