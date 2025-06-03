from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
from enum import Enum
from datetime import datetime


class AnalysisStatus(str, Enum):
    """Status of the analysis process."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class StartupAnalysis(BaseModel):
    """Schema for the startup analysis results."""
    id: UUID = Field(default_factory=uuid4, description="Unique identifier for the analysis")
    created_at: datetime = Field(default_factory=datetime.now, description="When the analysis was created")
    pitch: str = Field(..., description="Generated startup pitch")
    marketViability: float = Field(..., ge=0, le=100, description="Market viability score (0-100)")
    financialViability: float = Field(..., ge=0, le=100, description="Financial viability score (0-100)")
    innovationScore: float = Field(..., ge=0, le=100, description="Innovation score (0-100)")
    riskAssessment: float = Field(..., ge=0, le=100, description="Risk assessment score (0-100, higher is better)")
    overallScore: float = Field(..., ge=0, le=100, description="Overall viability score (0-100)")
    feedback: str = Field(..., description="Detailed feedback and recommendations")

    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "created_at": "2025-06-03T12:00:00.000Z",
                "pitch": "Introducing AI Freelance Matcher - a revolutionary solution for the Technology industry...",
                "marketViability": 78.5,
                "financialViability": 68.3,
                "innovationScore": 82.1,
                "riskAssessment": 62.7,
                "overallScore": 72.2,
                "feedback": "Your startup idea shows strong potential in the growing freelance economy..."
            }
        }


class AnalysisResponse(BaseModel):
    """Schema for the analysis response."""
    id: UUID = Field(..., description="Unique identifier for the analysis")
    status: AnalysisStatus = Field(..., description="Current status of the analysis")
    result: Optional[StartupAnalysis] = Field(None, description="Analysis results if completed")
    message: Optional[str] = Field(None, description="Status message or error details")

    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "status": "completed",
                "result": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "created_at": "2025-06-03T12:00:00.000Z",
                    "pitch": "Introducing AI Freelance Matcher - a revolutionary solution...",
                    "marketViability": 78.5,
                    "financialViability": 68.3,
                    "innovationScore": 82.1,
                    "riskAssessment": 62.7,
                    "overallScore": 72.2,
                    "feedback": "Your startup idea shows strong potential..."
                },
                "message": None
            }
        }


class AnalysisRequest(BaseModel):
    """Schema for requesting an analysis by ID."""
    analysis_id: UUID = Field(..., description="Unique identifier of the analysis to retrieve")

    class Config:
        schema_extra = {
            "example": {
                "analysis_id": "123e4567-e89b-12d3-a456-426614174000"
            }
        }

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from uuid import UUID, uuid4
from enum import Enum
from datetime import datetime


class AnalysisStatus(str, Enum):
    """Status of the analysis process."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class StartupAnalysis(BaseModel):
    """Schema for the startup analysis results."""
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.now)
    pitch: str
    marketViability: float = Field(..., ge=0, le=100)
    financialViability: float = Field(..., ge=0, le=100)
    innovationScore: float = Field(..., ge=0, le=100)
    riskAssessment: float = Field(..., ge=0, le=100)
    overallScore: float = Field(..., ge=0, le=100)
    feedback: str


class AnalysisResponse(BaseModel):
    """Schema for the analysis response."""
    id: UUID
    status: AnalysisStatus
    result: Optional[StartupAnalysis] = None
    message: Optional[str] = None

