export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  text: string;
  is_correct: boolean;
}

export interface QuizListItem {
  id: number;
  title: string;
  description: string;
}

export interface Quiz extends QuizListItem {
  questions: QuizQuestion[];
}

export interface QuizResponse {
  quiz: Quiz;
}

export interface ResultsState {
  quizTitle: string;
  questions: QuizQuestion[];
  answers: number[];
}

export interface BackendResponse {
  success?: boolean;
  error?: string;
}
