import { useEffect, useState } from "react";
import axios from "axios";
import { API_QUIZZES_URL } from "../config";
import type { QuizListItem } from "../types/quiz_types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GuardedLink } from "@/components/GuardedLink";

function Home() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get<{ quizzes: QuizListItem[] }>(
          `${API_QUIZZES_URL}`
        );
        setQuizzes(response.data.quizzes || []);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <h2>Available Quizzes:</h2>

      <div>
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <GuardedLink to={`/quiz/${quiz.id}`} requireLogin>
                  Start Quiz
                </GuardedLink>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Home;
