from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy instance
# This will be imported and initialized in app.py
db = SQLAlchemy()


def init_db(app):
    """
    Initialize the database with the Flask app.
    Creates all tables if they don't exist.

    Args:
        app: Flask application instance
    """
    db.init_app(app)

    with app.app_context():
        # Import all models to ensure they're registered with SQLAlchemy
        from models import topic, curriculum, question, progress

        # Create all tables
        db.create_all()
        print("Database initialized successfully")
