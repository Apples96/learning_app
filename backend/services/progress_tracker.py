from models.progress import UserProgress, SectionMastery
from models.question import Question
from database import db
from sqlalchemy import func


class ProgressTracker:
    """
    Service for tracking and calculating user progress and mastery levels.
    Manages answer submissions and progress statistics.
    """

    def record_answer(self, question_id, user_answer, is_correct):
        """
        Record a user's answer to a question.

        Args:
            question_id: ID of the question answered
            user_answer: User's submitted answer
            is_correct: Whether the answer was correct

        Returns:
            UserProgress instance
        """
        question = Question.query.get(question_id)
        if not question:
            raise Exception(f"Question {question_id} not found")

        # Count previous attempts for this question
        attempt_number = UserProgress.query.filter_by(question_id=question_id).count() + 1

        # Create progress record
        progress = UserProgress(
            section_id=question.section_id,
            question_id=question_id,
            answered_correctly=is_correct,
            user_answer=user_answer,
            attempt_number=attempt_number
        )

        db.session.add(progress)
        db.session.commit()

        # Update section mastery
        self.update_section_mastery(question.section_id)

        return progress

    def update_section_mastery(self, section_id):
        """
        Calculate and update mastery percentage for a section.

        Args:
            section_id: ID of the curriculum section

        Returns:
            SectionMastery instance
        """
        # Get all questions for this section
        total_questions = Question.query.filter_by(section_id=section_id).count()

        if total_questions == 0:
            return None

        # Get unique questions answered correctly
        # A question is considered mastered if it was answered correctly at least once
        correct_questions = db.session.query(func.count(func.distinct(UserProgress.question_id)))\
            .filter(
                UserProgress.section_id == section_id,
                UserProgress.answered_correctly == True
            ).scalar() or 0

        # Calculate mastery percentage
        mastery_percentage = (correct_questions / total_questions) * 100

        # Get or create section mastery record
        section_mastery = SectionMastery.query.filter_by(section_id=section_id).first()

        if section_mastery:
            section_mastery.questions_correct = correct_questions
            section_mastery.total_questions = total_questions
            section_mastery.mastery_percentage = mastery_percentage
        else:
            section_mastery = SectionMastery(
                section_id=section_id,
                questions_correct=correct_questions,
                total_questions=total_questions,
                mastery_percentage=mastery_percentage
            )
            db.session.add(section_mastery)

        db.session.commit()

        return section_mastery

    def get_section_progress(self, section_id):
        """
        Get progress statistics for a section.

        Args:
            section_id: ID of the curriculum section

        Returns:
            Dictionary with progress statistics
        """
        mastery = SectionMastery.query.filter_by(section_id=section_id).first()

        if not mastery:
            # Initialize mastery if not exists
            mastery = self.update_section_mastery(section_id)

        # Get total attempts
        total_attempts = UserProgress.query.filter_by(section_id=section_id).count()

        # Get correct attempts
        correct_attempts = UserProgress.query.filter_by(
            section_id=section_id,
            answered_correctly=True
        ).count()

        return {
            'section_id': section_id,
            'mastery_percentage': round(mastery.mastery_percentage, 2) if mastery else 0,
            'questions_correct': mastery.questions_correct if mastery else 0,
            'total_questions': mastery.total_questions if mastery else 0,
            'total_attempts': total_attempts,
            'correct_attempts': correct_attempts
        }

    def get_topic_progress(self, topic_id):
        """
        Get overall progress for a topic across all sections.

        Args:
            topic_id: ID of the topic

        Returns:
            Dictionary with topic progress statistics
        """
        from models.curriculum import CurriculumSection

        sections = CurriculumSection.query.filter_by(topic_id=topic_id).all()

        if not sections:
            return {
                'topic_id': topic_id,
                'overall_mastery': 0,
                'sections_completed': 0,
                'total_sections': 0,
                'sections_progress': []
            }

        sections_progress = []
        total_mastery = 0

        for section in sections:
            progress = self.get_section_progress(section.id)
            sections_progress.append(progress)
            total_mastery += progress['mastery_percentage']

        overall_mastery = total_mastery / len(sections) if sections else 0
        sections_completed = sum(1 for p in sections_progress if p['mastery_percentage'] >= 100)

        return {
            'topic_id': topic_id,
            'overall_mastery': round(overall_mastery, 2),
            'sections_completed': sections_completed,
            'total_sections': len(sections),
            'sections_progress': sections_progress
        }
