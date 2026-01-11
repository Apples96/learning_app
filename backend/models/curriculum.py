from database import db
from datetime import datetime


class CurriculumSection(db.Model):
    """
    Represents a section within a topic's curriculum.
    Each section covers specific concepts and has multiple questions.
    Sections are ordered to provide progressive learning from basics to advanced.
    """
    __tablename__ = 'curriculum_sections'

    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    title = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, nullable=False)  # 1, 2, 3... for progression
    difficulty_level = db.Column(db.String(50), nullable=False)  # beginner, intermediate, advanced
    key_concepts = db.Column(db.Text)  # JSON string or comma-separated concepts
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to questions
    questions = db.relationship('Question', backref='section', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Convert curriculum section to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'topic_id': self.topic_id,
            'title': self.title,
            'description': self.description,
            'order': self.order,
            'difficulty_level': self.difficulty_level,
            'key_concepts': self.key_concepts,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'questions_count': len(self.questions)
        }
