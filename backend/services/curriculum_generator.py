from services.ai_service import AIService
from models.curriculum import CurriculumSection
from database import db
import json


class CurriculumGenerator:
    """
    Service for generating and managing curriculum sections for topics.
    Uses AI service to create structured learning paths.
    """

    def __init__(self):
        """Initialize with AI service"""
        self.ai_service = AIService()

    def generate_for_topic(self, topic):
        """
        Generate a complete curriculum for a topic.

        Args:
            topic: Topic model instance

        Returns:
            List of created CurriculumSection instances
        """
        try:
            # Generate curriculum using AI
            curriculum_data = self.ai_service.generate_curriculum(
                topic_name=topic.name,
                description=topic.description,
                level=topic.level,
                focus_areas=topic.focus_areas
            )

            sections = []

            # Create curriculum sections in database
            for index, section_data in enumerate(curriculum_data, start=1):
                section = CurriculumSection(
                    topic_id=topic.id,
                    title=section_data['title'],
                    description=section_data['description'],
                    order=index,
                    difficulty_level=section_data['difficulty_level'],
                    key_concepts=json.dumps(section_data['key_concepts'])  # Store as JSON string
                )

                db.session.add(section)
                sections.append(section)

            db.session.commit()

            return sections

        except Exception as e:
            db.session.rollback()
            raise Exception(f"Failed to generate curriculum: {str(e)}")
