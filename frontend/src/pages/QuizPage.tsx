import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_QUIZ_URL } from "../config";
import type { Quiz, QuizResponse, ResultsState } from "../types/quiz_types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

function QuizPage() {
  const { quiz_id } = useParams<{ quiz_id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.post<QuizResponse>(
          `${API_QUIZ_URL}/${quiz_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setQuiz(response.data.quiz);
      } catch (error) {
        console.error("Error loading quiz:", error);
      }
    };
    fetchQuiz();
  }, [quiz_id]);

  if (!quiz) return <div>Loading...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleConfirm = () => {
    if (selectedOption === null) return; // can't confirm without selecting
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(updatedAnswers);
    setSelectedOption(null); // reset for next question

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // quiz finished then go to results page
      navigate(`/results`, {
        state: {
          quizTitle: quiz.title,
          questions: quiz.questions,
          answers: updatedAnswers,
        } satisfies ResultsState,
      });
    }
  };

  return (
    <>
      <Label>{quiz.title}</Label>
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.question}</CardTitle>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={selectedOption?.toString() || ""}
            onValueChange={(val) => setSelectedOption(Number(val))}
          >
            {currentQuestion.answers.map((ans) => (
              <div key={ans.id}>
                <RadioGroupItem
                  value={ans.id.toString()}
                  id={`option-${ans.id}`}
                />
                <Label htmlFor={`option-${ans.id}`}>{ans.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            variant="default"
          >
            {currentQuestionIndex + 1 === quiz.questions.length
              ? "Finish Quiz"
              : "Next Question"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default QuizPage;
