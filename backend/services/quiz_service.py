import json
from db.models import Quiz, Question, Answer
from repositories.quiz_repository import (
    save_quiz,
    get_all_quizzes,
    get_quiz_by_id,
)


def upload_quiz_service(session, file, user_id: int):
    """Validate and process uploaded quiz JSON before saving."""
    try:
        data = json.load(file)
    except Exception:
        raise ValueError("Invalid JSON file")

    title = data.get("title")
    if not title:
        raise ValueError("Missing 'title' field")

    questions = data.get("questions")
    if not questions or not isinstance(questions, list):
        raise ValueError("'questions' must be a non-empty list")

    description = data.get("description", "No description")

    quiz = Quiz(title=title, description=description, user_id=user_id)

    for q in questions:
        question = Question(text=q["question"])
        for i, answer_text in enumerate(q["answers"]):
            answer = Answer(text=answer_text, is_correct=(i == q["answer_index"]))
            question.answers.append(answer)
        quiz.questions.append(question)

    quiz = save_quiz(session, quiz)


def get_all_quizzes_service(session):
    quiz_list = []
    quizzes = get_all_quizzes(session)
    for q in quizzes:
        quiz_list.append({"id": q.id, "title": q.title, "description": q.description})
    return quiz_list


def get_quiz_service(session, quiz_id):
    quiz = get_quiz_by_id(session, quiz_id)

    quiz_data = {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "questions": [
            {
                "id": q.id,
                "question": q.text,
                "answers": [
                    {
                        "id": a.id,
                        "text": a.text,
                        "is_correct": a.is_correct,
                    }
                    for a in q.answers
                ],
            }
            for q in quiz.questions
        ],
    }

    return quiz_data
