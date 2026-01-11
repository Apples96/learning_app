from flask import Blueprint, request, jsonify
from models.question import Question
from services.ai_service import AIService
from services.progress_tracker import ProgressTracker

# Create blueprint for question routes
questions_bp = Blueprint('questions', __name__, url_prefix='/api/questions')


@questions_bp.route('/<int:question_id>', methods=['GET'])
def get_question(question_id):
    """
    Get a specific question without the answer.
    """
    try:
        question = Question.query.get(question_id)

        if not question:
            return jsonify({
                'success': False,
                'error': 'Question not found'
            }), 404

        return jsonify({
            'success': True,
            'question': question.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@questions_bp.route('/<int:question_id>/answer', methods=['POST'])
def submit_answer(question_id):
    """
    Submit an answer to a question and get feedback.
    Expects JSON body with: user_answer
    Returns: feedback with correctness, explanation
    """
    try:
        question = Question.query.get(question_id)

        if not question:
            return jsonify({
                'success': False,
                'error': 'Question not found'
            }), 404

        data = request.get_json()
        user_answer = data.get('user_answer')

        if user_answer is None:
            return jsonify({
                'success': False,
                'error': 'Missing user_answer in request body'
            }), 400

        # Check if answer is correct
        is_correct = False
        feedback = {}

        if question.question_type == 'mcq':
            # For MCQ, simple string comparison
            is_correct = user_answer.strip().lower() == question.correct_answer.strip().lower()

            feedback = {
                'is_correct': is_correct,
                'correct_answer': question.correct_answer,
                'explanation': question.explanation,
                'score': 100 if is_correct else 0
            }

        elif question.question_type in ['open_ended', 'visual']:
            # For open-ended and visual questions, use AI evaluation
            ai_service = AIService()
            evaluation = ai_service.evaluate_answer(
                question.question_text,
                question.correct_answer,
                user_answer
            )

            is_correct = evaluation['is_correct']
            feedback = evaluation
            feedback['explanation'] = question.explanation

        # Record the answer in progress tracking
        progress_tracker = ProgressTracker()
        progress_tracker.record_answer(question_id, user_answer, is_correct)

        return jsonify({
            'success': True,
            'feedback': feedback
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@questions_bp.route('/<int:question_id>/explanation', methods=['GET'])
def get_explanation(question_id):
    """
    Get the detailed explanation for a question.
    """
    try:
        question = Question.query.get(question_id)

        if not question:
            return jsonify({
                'success': False,
                'error': 'Question not found'
            }), 404

        return jsonify({
            'success': True,
            'question_id': question_id,
            'correct_answer': question.correct_answer,
            'explanation': question.explanation
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
