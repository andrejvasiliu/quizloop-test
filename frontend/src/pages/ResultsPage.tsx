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

  const score = questions.reduce((acc, question, i) => {
    const selectedAnswer = answers[i];
    const selected = question.answers.find((ans) => ans.id === selectedAnswer);
    return acc + (selected?.is_correct ? 1 : 0);
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
          const selectedAnswerID = answers[index];
          const selectedAnswer = question.answers.find(
            (ans) => ans.id === selectedAnswerID
          );
          const correctAnswer = question.answers.find((ans) => ans.is_correct);

          return (
            <Card key={question.id ?? index}>
              <CardHeader>
                <CardTitle>{question.question}</CardTitle>
              </CardHeader>
              <CardContent>
                Your answer: {selectedAnswer?.text}{" "}
                {selectedAnswer?.is_correct ? "✅" : "❌"}
                {!selectedAnswer?.is_correct && (
                  <p>
                    Correct answer: <strong>{correctAnswer?.text}</strong>
                  </p>
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
