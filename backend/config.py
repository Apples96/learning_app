import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """
    Configuration class for the Flask application.
    Loads settings from environment variables with fallback defaults.
    """
    # Secret key for session management
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///learning_app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Anthropic API configuration
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

    # Flask environment
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
