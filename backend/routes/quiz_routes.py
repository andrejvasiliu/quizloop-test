from flask import Blueprint, request, jsonify, g
from utils.auth import token_required
from services.quiz_service import (
    upload_quiz_service,
    get_all_quizzes_service,
    get_quiz_service,
)
from db.session import get_session

quiz_routes_bp = Blueprint("quiz_routes", __name__)


@quiz_routes_bp.route("/upload", methods=["POST"])
@token_required
def upload_quiz():
    if "quiz_json" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["quiz_json"]

    try:
        # quiz, questions, answers = get_quiz_data_from_json(file)

        # quiz_id = add_quiz(quiz)

        # question_ids = []
        # for q in range(len(questions)):
        #     question_ids.append(add_question(questions[q], quiz_id))

        # add_answers(answers, question_ids)

        upload_quiz_service(file, g.current_user_id)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"success": True}), 200


@quiz_routes_bp.route("/quizzes", methods=["GET"])
def list_quizzes():
    try:
        with get_session() as session:
            quiz_list = get_all_quizzes_service(session)
            return jsonify({"quizzes": quiz_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quiz_routes_bp.route("/quiz/<quiz_id>", methods=["POST"])
@token_required
def start_quiz(quiz_id):
    try:
        with get_session() as session:
            quiz_data = get_quiz_service(session, quiz_id)
            return jsonify({"quiz": quiz_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @quiz_routes_bp.route("/submit/<quiz_name>", methods=["POST"])
# @token_required


# def get_quiz_data_from_json(file):
#     if not file:
#         raise Exception("Missing quiz json file")

#     data = json.load(file)
#     quiz = []
#     questions = []
#     answers = []

#     description = data.get("description")
#     if description is None:
#         description = "No description"

#     quiz.append(
#         (
#             str(data.get("title")),
#             str(description),
#             g.current_user_id,
#         )
#     )
#     for q in data.get("questions"):
#         questions.append(q.get("question"))
#         temp_answers = []
#         for a in q.get("answers"):
#             temp_answers.append(a)
#         answers.append((temp_answers, q.get("answer_index")))

#     if len(questions) != len(answers):
#         return jsonify({"error": "Invalid quiz format"}), 400

#     return quiz, questions, answers
