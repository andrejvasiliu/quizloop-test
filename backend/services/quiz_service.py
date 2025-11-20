import json
from repositories.quiz_repository import (
    create_quiz_with_questions_and_answers,
    get_all_quizzes,
    get_quiz_by_id,
)


def upload_quiz_service(file, user_id: int):
    """Validate and process uploaded quiz JSON before saving."""
    try:
        data = json.load(file)
    except Exception:
        raise ValueError("Invalid JSON file")

    # Basic validation
    title = data.get("title")
    if not title:
        raise ValueError("Missing 'title' field")

    questions = data.get("questions")
    if not questions or not isinstance(questions, list):
        raise ValueError("'questions' must be a non-empty list")

    description = data.get("description", "No description")

    # Call repository to persist
    create_quiz_with_questions_and_answers(
        title=title, description=description, user_id=user_id, questions=questions
    )


def get_all_quizzes_service(session):
    quiz_list = []
    quizzes = get_all_quizzes(session)
    for q in quizzes:
        quiz_list.append({"id": q.id, "title": q.title, "description": q.description})
    return quiz_list


def get_quiz_service(session, quiz_id):
    # quiz_data = {}
    # questions_and_answers = []

    # try:
    #     quiz = session.query(Quiz).filter((Quiz.id == quiz_id)).first()
    #     questions = session.query(Question).filter((Question.quiz_id == quiz_id)).all()

    #     for q in questions:
    #         answers = session.query(Answer).filter((Answer.question_id == q.id)).all()
    #         temp_answers = []

    #         for a in answers:
    #             temp_answers.append((a.text))
    #             if a.is_correct:
    #                 temp_index = answers.index(a)

    #         questions_and_answers.append(
    #             {
    #                 "question": q.text,
    #                 "answers": temp_answers,
    #                 "answer_index": temp_index,
    #             }
    #         )

    #     session.close()
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

    # quiz_data.update(
    #     {"id": str(quiz.id), "title": quiz.title, "description": quiz.description}
    # )
    # quiz_data.update({"questions": questions_and_answers})

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


# def add_quiz(quiz):
#     session = SessionLocal()

#     try:
#         quiz = Quiz(title=quiz[0][0], description=quiz[0][1], user_id=quiz[0][2])
#         session.add(quiz)
#         session.commit()
#         quiz_id = quiz.id
#         session.close()

#         return quiz_id
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# def add_question(question, quiz_id):
#     session = SessionLocal()

#     try:
#         question = Question(text=question, quiz_id=quiz_id)
#         session.add(question)
#         session.commit()
#         question_id = question.id
#         session.close()

#         return question_id
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# def add_answers(answers, question_ids):
#     session = SessionLocal()

#     try:
#         # current_answer_index = 0
#         # for a in answers:
#         #     answer_tuple_index = answers.index(a)
#         #     correct_answer_index = a[1]
#         #     while current_answer_index < len(a[0]):
#         #         answer_index = a[0].index(a[0][current_answer_index])
#         #         answer = Answer(
#         #             text=a[0][current_answer_index],
#         #             is_correct=answer_index == correct_answer_index,
#         #             question_id=question_ids[answer_tuple_index],
#         #         )
#         #         session.add(answer)
#         #         current_answer_index += 1
#         #     current_answer_index = 0

#         for question_idx, (answers, correct_idx) in enumerate(answers):
#             for i, text in enumerate(answers):
#                 answer = Answer(
#                     text=text,
#                     is_correct=(correct_idx == i),
#                     question_id=question_ids[question_idx],
#                 )
#                 session.add(answer)

#         session.commit()
#         session.close()
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
