from flask import Blueprint, request, jsonify
from models.topic import Topic
from services.curriculum_generator import CurriculumGenerator
from services.question_generator import QuestionGenerator
from database import db

# Create blueprint for topic routes
topics_bp = Blueprint('topics', __name__, url_prefix='/api/topics')


@topics_bp.route('', methods=['GET'])
def get_topics():
    """
    Get all topics with basic info.
    Returns list of topics.
    """
    try:
        topics = Topic.query.order_by(Topic.created_at.desc()).all()
        return jsonify({
            'success': True,
            'topics': [topic.to_dict() for topic in topics]
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@topics_bp.route('/<int:topic_id>', methods=['GET'])
def get_topic(topic_id):
    """
    Get a specific topic with its curriculum sections.
    """
    try:
        topic = Topic.query.get(topic_id)

        if not topic:
            return jsonify({
                'success': False,
                'error': 'Topic not found'
            }), 404

        # Include curriculum sections
        topic_data = topic.to_dict()
        topic_data['sections'] = [section.to_dict() for section in topic.sections]

        return jsonify({
            'success': True,
            'topic': topic_data
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@topics_bp.route('', methods=['POST'])
def create_topic():
    """
    Create a new topic and generate its curriculum.
    Expects JSON body with: name, description, level, focus_areas (optional)
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('name') or not data.get('description') or not data.get('level'):
            return jsonify({
                'success': False,
                'error': 'Missing required fields: name, description, level'
            }), 400

        # Validate level
        valid_levels = ['beginner', 'intermediate', 'advanced']
        if data['level'] not in valid_levels:
            return jsonify({
                'success': False,
                'error': f'Invalid level. Must be one of: {", ".join(valid_levels)}'
            }), 400

        # Create topic
        topic = Topic(
            name=data['name'],
            description=data['description'],
            level=data['level'],
            focus_areas=data.get('focus_areas', '')
        )

        db.session.add(topic)
        db.session.commit()

        # Generate curriculum for the topic
        curriculum_generator = CurriculumGenerator()
        sections = curriculum_generator.generate_for_topic(topic)

        # Generate initial questions for each section (MCQ by default)
        question_generator = QuestionGenerator()
        for section in sections:
            question_generator.generate_for_section(section, question_type='mcq', count=10)

        # Reload topic with sections and questions
        db.session.refresh(topic)

        topic_data = topic.to_dict()
        topic_data['sections'] = [section.to_dict() for section in topic.sections]

        return jsonify({
            'success': True,
            'message': 'Topic created successfully with curriculum',
            'topic': topic_data
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@topics_bp.route('/<int:topic_id>', methods=['DELETE'])
def delete_topic(topic_id):
    """
    Delete a topic and all its associated data.
    """
    try:
        topic = Topic.query.get(topic_id)

        if not topic:
            return jsonify({
                'success': False,
                'error': 'Topic not found'
            }), 404

        db.session.delete(topic)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Topic deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
