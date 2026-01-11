from services.ai_service import AIService
from models.question import Question
from database import db
import json


class QuestionGenerator:
    """
    Service for generating and managing questions for curriculum sections.
    Uses AI service to create diverse question types.
    """

    def __init__(self):
        """Initialize with AI service"""
        self.ai_service = AIService()

    def generate_for_section(self, section, question_type='mcq', count=10, batch=1):
        """
        Generate questions for a curriculum section.

        Args:
            section: CurriculumSection model instance
            question_type: Type of questions (mcq, open_ended, visual)
            count: Number of questions to generate
            batch: Batch number for question regeneration tracking

        Returns:
            List of created Question instances
        """
        try:
            # Parse key concepts from JSON string
            key_concepts = json.loads(section.key_concepts) if section.key_concepts else []

            # Generate questions using AI
            questions_data = self.ai_service.generate_questions(
                section_title=section.title,
                section_description=section.description,
                key_concepts=key_concepts,
                difficulty_level=section.difficulty_level,
                question_type=question_type,
                count=count
            )

            questions = []

            # Create questions in database
            for question_data in questions_data:
                # For MCQ, store options as JSON string
                options_json = None
                if question_type == 'mcq' and 'options' in question_data:
                    options_json = json.dumps(question_data['options'])

                question = Question(
                    section_id=section.id,
                    question_text=question_data['question_text'],
                    question_type=question_type,
                    correct_answer=question_data['correct_answer'],
                    options=options_json,
                    explanation=question_data['explanation'],
                    difficulty=section.difficulty_level,
                    generation_batch=batch
                )

                db.session.add(question)
                questions.append(question)

            db.session.commit()

            return questions

        except Exception as e:
            db.session.rollback()
            raise Exception(f"Failed to generate questions: {str(e)}")

    def regenerate_for_section(self, section, question_type='mcq', count=10):
        """
        Regenerate questions for a section (creates new batch).

        Args:
            section: CurriculumSection model instance
            question_type: Type of questions to generate
            count: Number of questions to generate

        Returns:
            List of newly created Question instances
        """
        # Find the highest batch number for this section
        max_batch = db.session.query(db.func.max(Question.generation_batch))\
            .filter(Question.section_id == section.id)\
            .scalar() or 0

        new_batch = max_batch + 1

        return self.generate_for_section(section, question_type, count, new_batch)
