from flask import Blueprint, jsonify
from services.progress_tracker import ProgressTracker

# Create blueprint for progress routes
progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')


@progress_bp.route('/topics/<int:topic_id>', methods=['GET'])
def get_topic_progress(topic_id):
    """
    Get overall progress for a topic.
    Returns mastery percentage, sections completed, and detailed section progress.
    """
    try:
        progress_tracker = ProgressTracker()
        progress = progress_tracker.get_topic_progress(topic_id)

        return jsonify({
            'success': True,
            'progress': progress
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@progress_bp.route('/sections/<int:section_id>', methods=['GET'])
def get_section_progress(section_id):
    """
    Get progress for a specific section.
    Returns mastery percentage, questions answered, attempts, etc.
    """
    try:
        progress_tracker = ProgressTracker()
        progress = progress_tracker.get_section_progress(section_id)

        return jsonify({
            'success': True,
            'progress': progress
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
