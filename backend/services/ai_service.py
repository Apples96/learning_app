import anthropic
import json
from config import Config


class AIService:
    """
    Service for interacting with Anthropic Claude API.
    Handles curriculum generation, question generation, and answer evaluation.
    """

    def __init__(self):
        """Initialize the Anthropic client with API key from config"""
        self.client = anthropic.Anthropic(api_key=Config.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-5-20250929"  # Using Claude Sonnet 4.5

    def generate_curriculum(self, topic_name, description, level, focus_areas):
        """
        Generate a structured curriculum for a given topic.

        Args:
            topic_name: Name of the topic
            description: Detailed description of what to learn
            level: User's desired level (beginner, intermediate, advanced)
            focus_areas: Specific areas to focus on

        Returns:
            List of curriculum sections with title, description, key_concepts, and difficulty_level
        """
        prompt = f"""You are an expert educator creating a comprehensive learning curriculum.

Topic: {topic_name}
Description: {description}
Target Level: {level}
Focus Areas: {focus_areas or 'General overview'}

Generate a structured learning curriculum with 5-8 sections that progress from foundational concepts to advanced topics.

For each section, provide:
1. title: Clear, descriptive title (max 100 characters)
2. description: Brief description of what the learner will master (2-3 sentences)
3. key_concepts: List of 3-5 key concepts covered in this section
4. difficulty_level: One of: beginner, intermediate, advanced

Structure the curriculum to:
- Start with foundational concepts and terminology
- Progress to intermediate practical applications
- Advance to complex scenarios and specialized knowledge
- Build upon previous sections logically

Return ONLY a valid JSON array with this exact structure:
[
  {{
    "title": "Section title",
    "description": "What learner will master",
    "key_concepts": ["concept1", "concept2", "concept3"],
    "difficulty_level": "beginner"
  }},
  ...
]"""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )

            # Extract the response text
            response_text = message.content[0].text

            # Remove markdown code blocks if present
            response_text = response_text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]  # Remove ```json
            elif response_text.startswith('```'):
                response_text = response_text[3:]  # Remove ```
            if response_text.endswith('```'):
                response_text = response_text[:-3]  # Remove closing ```
            response_text = response_text.strip()

            # Parse JSON response
            curriculum = json.loads(response_text)

            return curriculum

        except json.JSONDecodeError as e:
            print(f"Error parsing curriculum JSON: {e}")
            print(f"Response: {response_text}")
            raise Exception("Failed to parse curriculum from AI response")
        except Exception as e:
            print(f"Error generating curriculum: {e}")
            raise

    def generate_questions(self, section_title, section_description, key_concepts,
                          difficulty_level, question_type, count=10):
        """
        Generate questions for a curriculum section.

        Args:
            section_title: Title of the curriculum section
            section_description: Description of what the section covers
            key_concepts: List of key concepts to test
            difficulty_level: Difficulty level (beginner, intermediate, advanced)
            question_type: Type of questions (mcq, open_ended, visual)
            count: Number of questions to generate

        Returns:
            List of questions with text, type, answer, explanation, and options (for MCQ)
        """
        # Format key concepts for the prompt
        concepts_str = ", ".join(key_concepts) if isinstance(key_concepts, list) else key_concepts

        if question_type == 'mcq':
            question_format = """
{
  "question_text": "The question text",
  "correct_answer": "The correct answer text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "explanation": "Detailed explanation of why the correct answer is right and why other options are wrong"
}"""
        elif question_type == 'open_ended':
            question_format = """
{
  "question_text": "The question requiring explanation or analysis",
  "correct_answer": "Comprehensive answer covering key points",
  "explanation": "Additional context and what a good answer should include"
}"""
        else:  # visual/practical
            question_format = """
{
  "question_text": "Practical scenario or problem to solve. Include ASCII art, diagrams, matrices, code examples, or visual representations when helpful. Use proper spacing and formatting.",
  "correct_answer": "The solution or approach",
  "explanation": "Step-by-step explanation of the solution"
}"""

        prompt = f"""You are an expert educator creating assessment questions.

Section: {section_title}
Description: {section_description}
Key Concepts: {concepts_str}
Difficulty Level: {difficulty_level}
Question Type: {question_type}

Generate {count} high-quality {question_type} questions that test understanding of these key concepts.

Requirements:
- Questions should be clear, unambiguous, and at {difficulty_level} level
- Test understanding, not just memorization
- Cover different aspects of the key concepts
- {"For MCQ: Provide 4 options where wrong answers are plausible but clearly incorrect. The correct answer should be in different positions (not always first) across questions." if question_type == 'mcq' else ''}
- {"For Visual/Practical: Include visual representations directly in the question_text when helpful. Use ASCII art for diagrams/networks, properly formatted matrices, code blocks, tables, or flowcharts. Examples: neural network layers as ASCII, matrix multiplication with clear spacing, data structures as diagrams, algorithm steps as flowcharts. Make it visually engaging!" if question_type == 'visual' else ''}
- Explanations should be educational and help learners understand the concept better
- {"Options should be distinct and not overlapping" if question_type == 'mcq' else ''}

Return ONLY a valid JSON array with this exact structure:
[{question_format}, ...]"""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=8000,
                messages=[{"role": "user", "content": prompt}]
            )

            # Extract the response text
            response_text = message.content[0].text

            # Remove markdown code blocks if present
            response_text = response_text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]  # Remove ```json
            elif response_text.startswith('```'):
                response_text = response_text[3:]  # Remove ```
            if response_text.endswith('```'):
                response_text = response_text[:-3]  # Remove closing ```
            response_text = response_text.strip()

            # Parse JSON response
            questions = json.loads(response_text)

            return questions

        except json.JSONDecodeError as e:
            print(f"Error parsing questions JSON: {e}")
            print(f"Response: {response_text}")
            raise Exception("Failed to parse questions from AI response")
        except Exception as e:
            print(f"Error generating questions: {e}")
            raise

    def evaluate_answer(self, question_text, correct_answer, user_answer):
        """
        Evaluate a user's answer to an open-ended question.

        Args:
            question_text: The question that was asked
            correct_answer: The expected correct answer
            user_answer: The user's submitted answer

        Returns:
            Dictionary with evaluation results (is_correct, score, feedback)
        """
        prompt = f"""You are an expert educator evaluating a student's answer.

Question: {question_text}

Expected Answer: {correct_answer}

Student's Answer: {user_answer}

Evaluate the student's answer and provide:
1. is_correct: true if substantially correct, false if incorrect
2. score: percentage score (0-100)
3. feedback: Constructive feedback explaining what's right/wrong and how to improve

Return ONLY a valid JSON object with this exact structure:
{{
  "is_correct": true/false,
  "score": 85,
  "feedback": "Detailed feedback here..."
}}"""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )

            # Extract the response text
            response_text = message.content[0].text

            # Remove markdown code blocks if present
            response_text = response_text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]  # Remove ```json
            elif response_text.startswith('```'):
                response_text = response_text[3:]  # Remove ```
            if response_text.endswith('```'):
                response_text = response_text[:-3]  # Remove closing ```
            response_text = response_text.strip()

            # Parse JSON response
            evaluation = json.loads(response_text)

            return evaluation

        except json.JSONDecodeError as e:
            print(f"Error parsing evaluation JSON: {e}")
            print(f"Response: {response_text}")
            raise Exception("Failed to parse evaluation from AI response")
        except Exception as e:
            print(f"Error evaluating answer: {e}")
            raise
