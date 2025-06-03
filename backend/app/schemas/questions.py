from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict


class Question(BaseModel):
    """Schema for a single question in the startup questionnaire."""
    id: str = Field(..., description="Unique identifier for the question")
    question: str = Field(..., description="The question text")
    description: Optional[str] = Field(None, description="Additional description or hint for the question")
    placeholder: Optional[str] = Field(None, description="Placeholder text for the input field")
    required: bool = Field(True, description="Whether the question is required")
    multiline: bool = Field(False, description="Whether the answer requires a multiline input")

    class Config:
        schema_extra = {
            "example": {
                "id": "idea",
                "question": "What is your startup idea?",
                "description": "Briefly describe your startup concept in a sentence or two.",
                "placeholder": "Type your answer here...",
                "required": True,
                "multiline": True
            }
        }


class StartupFormData(BaseModel):
    """Schema for the complete startup questionnaire form data."""
    idea: str = Field(..., description="The startup idea")
    industry: str = Field(..., description="The industry of the startup")
    targetAudience: str = Field(..., description="The target audience of the startup")
    problemSolved: str = Field(..., description="The problem the startup solves")
    competitiveAdvantage: str = Field(..., description="The competitive advantage of the startup")
    businessModel: str = Field(..., description="The business model of the startup")
    fundingNeeds: str = Field(..., description="Funding needs and capital allocation")

    @validator('idea', 'industry', 'targetAudience', 'problemSolved', 'competitiveAdvantage', 'businessModel', 'fundingNeeds')
    def check_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty')
        return v

    class Config:
        schema_extra = {
            "example": {
                "idea": "A platform that uses AI to match freelancers with projects based on their skills and availability",
                "industry": "Technology / Freelancing",
                "targetAudience": "Freelance professionals and businesses seeking specialized talent",
                "problemSolved": "Difficulty finding the right talent for short-term projects and inefficient matching process",
                "competitiveAdvantage": "AI-powered matching algorithm that considers skills, experience, and work style compatibility",
                "businessModel": "Commission-based fee on successful matches and premium subscription for additional features",
                "fundingNeeds": "$500,000 for initial platform development, marketing, and 12 months of operations"
            }
        }


class QuestionnaireRequest(BaseModel):
    """Schema for requesting the questionnaire."""
    locale: Optional[str] = Field("en-US", description="The locale for localized questions")

    class Config:
        schema_extra = {
            "example": {
                "locale": "en-US"
            }
        }


class QuestionnaireResponse(BaseModel):
    """Schema for the questionnaire response."""
    questions: List[Question] = Field(..., description="List of questions in the questionnaire")

    class Config:
        schema_extra = {
            "example": {
                "questions": [
                    {
                        "id": "idea",
                        "question": "What is your startup idea?",
                        "description": "Briefly describe your startup concept in a sentence or two.",
                        "required": True,
                        "multiline": True
                    }
                ]
            }
        }

from pydantic import BaseModel
from typing import List, Optional, Dict


class Question(BaseModel):
    """Schema for a single question in the startup questionnaire."""
    id: str
    question: str
    description: Optional[str] = None
    placeholder: Optional[str] = None
    required: bool = True
    multiline: bool = False


class StartupFormData(BaseModel):
    """Schema for the complete startup questionnaire form data."""
    idea: str
    industry: str
    targetAudience: str
    problemSolved: str
    competitiveAdvantage: str
    businessModel: str
    fundingNeeds: str


class QuestionnaireRequest(BaseModel):
    """Schema for requesting the questionnaire."""
    locale: Optional[str] = "en-US"


class QuestionnaireResponse(BaseModel):
    """Schema for the questionnaire response."""
    questions: List[Question]

