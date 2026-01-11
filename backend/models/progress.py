from database import db
from datetime import datetime


class UserProgress(db.Model):
    """
    Tracks user's progress on individual questions.
    Records each attempt and whether it was correct.
    """
    __tablename__ = 'user_progress'

    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('curriculum_sections.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    answered_correctly = db.Column(db.Boolean, nullable=False)
    user_answer = db.Column(db.Text)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)
    attempt_number = db.Column(db.Integer, default=1)

    def to_dict(self):
        """Convert progress record to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'section_id': self.section_id,
            'question_id': self.question_id,
            'answered_correctly': self.answered_correctly,
            'user_answer': self.user_answer,
            'attempted_at': self.attempted_at.isoformat() if self.attempted_at else None,
            'attempt_number': self.attempt_number
        }


class SectionMastery(db.Model):
    """
    Tracks overall mastery level for each curriculum section.
    Calculates percentage based on correct answers.
    """
    __tablename__ = 'section_mastery'

    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('curriculum_sections.id'), nullable=False, unique=True)
    questions_correct = db.Column(db.Integer, default=0)
    total_questions = db.Column(db.Integer, default=0)
    mastery_percentage = db.Column(db.Float, default=0.0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert section mastery to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'section_id': self.section_id,
            'questions_correct': self.questions_correct,
            'total_questions': self.total_questions,
            'mastery_percentage': round(self.mastery_percentage, 2),
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }
