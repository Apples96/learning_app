from database import db
from datetime import datetime
import json


class Question(db.Model):
    """
    Represents a question within a curriculum section.
    Supports multiple question types: MCQ, open-ended, and visual/practical.
    """
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('curriculum_sections.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), nullable=False)  # mcq, open_ended, visual
    correct_answer = db.Column(db.Text, nullable=False)
    options = db.Column(db.Text)  # JSON string for MCQ options
    explanation = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(50))  # easy, medium, hard
    generation_batch = db.Column(db.Integer, default=1)  # Track question regeneration batches
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to user progress
    progress_records = db.relationship('UserProgress', backref='question', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Convert question to dictionary for JSON serialization"""
        result = {
            'id': self.id,
            'section_id': self.section_id,
            'question_text': self.question_text,
            'question_type': self.question_type,
            'difficulty': self.difficulty,
            'generation_batch': self.generation_batch,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

        # Parse options for MCQ
        if self.question_type == 'mcq' and self.options:
            try:
                result['options'] = json.loads(self.options)
            except json.JSONDecodeError:
                result['options'] = []

        return result

    def to_dict_with_answer(self):
        """Convert question to dictionary including answer and explanation"""
        result = self.to_dict()
        result['correct_answer'] = self.correct_answer
        result['explanation'] = self.explanation
        return result
