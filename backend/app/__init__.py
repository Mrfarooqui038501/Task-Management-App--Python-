from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=False)

    # disable strict slashes to avoid 308/301 redirects between /api/tasks and /api/tasks/
    app.url_map.strict_slashes = False

    # Use sqlite DB file inside backend folder for easy local dev
    base_dir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(os.path.dirname(base_dir), "db.sqlite3")

    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='sqlite:///' + db_path,
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    # -- Allow CORS for our frontend (dev on localhost:5173)
    # You can allow all origins during development:
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
         supports_credentials=True,
         expose_headers=["Content-Type"])

    # Import models so tables get created
    with app.app_context():
        from . import models
        db.create_all()

    # Register blueprints
    from .routes.tasks import bp as tasks_bp
    from .routes.comments import bp as comments_bp

    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(comments_bp, url_prefix='/api')

    return app
