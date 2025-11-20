from flask import Flask
from flask_cors import CORS
from db.db import Base, engine
from db.models import User, Quiz, Question, Answer
from routes.quiz_routes import quiz_routes_bp
from routes.auth_routes import auth_routes_bp


def create_app():
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = "super_secret"
    app.config["JWT_EXP_HOURS"] = 1

    with app.app_context():
        Base.metadata.create_all(bind=engine)

    app.register_blueprint(quiz_routes_bp)
    app.register_blueprint(auth_routes_bp)

    CORS(app, supports_credentials=True)

    return app
