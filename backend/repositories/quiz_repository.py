from db.models import Quiz, Question
from sqlalchemy.orm import selectinload


def save_quiz(session, quiz):
    session.add(quiz)
    session.flush()
    return quiz


def get_all_quizzes(session):
    return session.query(Quiz).all()


def get_quiz_by_id(session, quiz_id):
    return (
        session.query(Quiz)
        .options(selectinload(Quiz.questions).selectinload(Question.answers))
        .filter(Quiz.id == quiz_id)
        .first()
    )
