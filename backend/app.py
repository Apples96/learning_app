from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db

# Import route blueprints
from routes.topics import topics_bp
from routes.curriculum import curriculum_bp
from routes.questions import questions_bp
from routes.progress import progress_bp


def create_app():
    """
    Application factory for creating Flask app instance.
    Initializes database, registers blueprints, and configures CORS.

    Returns:
        Configured Flask application
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend communication
    CORS(app)

    # Initialize database
    init_db(app)

    # Register API blueprints
    app.register_blueprint(topics_bp)
    app.register_blueprint(curriculum_bp)
    app.register_blueprint(questions_bp)
    app.register_blueprint(progress_bp)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint to verify API is running"""
        return jsonify({
            'success': True,
            'message': 'Learning App API is running',
            'version': '1.0.0'
        }), 200

    # Root endpoint
    @app.route('/')
    def root():
        """Root endpoint with API information"""
        return jsonify({
            'message': 'Learning App API',
            'version': '1.0.0',
            'endpoints': {
                'topics': '/api/topics',
                'curriculum': '/api/curriculum',
                'questions': '/api/questions',
                'progress': '/api/progress',
                'health': '/api/health'
            }
        }), 200

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
