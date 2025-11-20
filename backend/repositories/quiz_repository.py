from db.session import get_session
from db.models import Quiz, Question, Answer
from sqlalchemy.orm import selectinload


def create_quiz_with_questions_and_answers(
    title: str, description: str, user_id: int, questions: list
):
    """
    Create a quiz and all its related questions/answers in one transaction.
    `questions` should be a list of dicts with:
    {
        "question": str,
        "answers": list[str],
        "answer_index": int
    }
    """
    with get_session() as session:
        quiz = Quiz(title=title, description=description, user_id=user_id)
        session.add(quiz)
        session.flush()  # flush assigns quiz.id without committing

        for q in questions:
            question = Question(text=q["question"], quiz_id=quiz.id)
            session.add(question)
            session.flush()  # assign question.id

            for i, answer_text in enumerate(q["answers"]):
                is_correct = i == q["answer_index"]
                answer = Answer(
                    text=answer_text, is_correct=is_correct, question_id=question.id
                )
                session.add(answer)


def get_all_quizzes(session):
    return session.query(Quiz).all()


def get_quiz_by_id(session, quiz_id):
    return (
        session.query(Quiz)
        .options(selectinload(Quiz.questions).selectinload(Question.answers))
        .filter(Quiz.id == quiz_id)
        .first()
    )
