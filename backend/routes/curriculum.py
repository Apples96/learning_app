from flask import Blueprint, request, jsonify
from models.curriculum import CurriculumSection
from models.question import Question
from services.question_generator import QuestionGenerator
import json

# Create blueprint for curriculum routes
curriculum_bp = Blueprint('curriculum', __name__, url_prefix='/api/curriculum')


@curriculum_bp.route('/sections/<int:section_id>', methods=['GET'])
def get_section(section_id):
    """
    Get a specific curriculum section with its questions.
    Query params:
    - question_type: Filter questions by type (mcq, open_ended, visual)
    - batch: Filter questions by generation batch
    """
    try:
        section = CurriculumSection.query.get(section_id)

        if not section:
            return jsonify({
                'success': False,
                'error': 'Section not found'
            }), 404

        # Get query parameters
        question_type = request.args.get('question_type')
        batch = request.args.get('batch', type=int)

        # Build query for questions
        questions_query = Question.query.filter_by(section_id=section_id)

        if question_type:
            questions_query = questions_query.filter_by(question_type=question_type)

        if batch:
            questions_query = questions_query.filter_by(generation_batch=batch)

        questions = questions_query.all()

        section_data = section.to_dict()
        section_data['key_concepts'] = json.loads(section.key_concepts) if section.key_concepts else []
        section_data['questions'] = [q.to_dict() for q in questions]

        return jsonify({
            'success': True,
            'section': section_data
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@curriculum_bp.route('/sections/<int:section_id>/regenerate', methods=['POST'])
def regenerate_questions(section_id):
    """
    Regenerate questions for a section.
    Expects JSON body with: question_type (optional, default: mcq), count (optional, default: 10)
    """
    try:
        section = CurriculumSection.query.get(section_id)

        if not section:
            return jsonify({
                'success': False,
                'error': 'Section not found'
            }), 404

        data = request.get_json() or {}
        question_type = data.get('question_type', 'mcq')
        count = data.get('count', 10)

        # Validate question type
        valid_types = ['mcq', 'open_ended', 'visual']
        if question_type not in valid_types:
            return jsonify({
                'success': False,
                'error': f'Invalid question type. Must be one of: {", ".join(valid_types)}'
            }), 400

        # Generate new questions
        question_generator = QuestionGenerator()
        new_questions = question_generator.regenerate_for_section(
            section, question_type=question_type, count=count
        )

        return jsonify({
            'success': True,
            'message': f'Generated {len(new_questions)} new {question_type} questions',
            'questions': [q.to_dict() for q in new_questions]
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
