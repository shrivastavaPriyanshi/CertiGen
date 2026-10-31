from datetime import date
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Individual recipient details
class RecipientCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr


# Bulk certificate generation request
class GenerationJobCreate(BaseModel):
    event_name: str = Field(min_length=3, max_length=150)
    completion_date: date
    recipients: list[RecipientCreate] = Field(min_length=1, max_length=1000)


# Response after creating a job
class GenerationJobResponse(BaseModel):
    job_id: str
    event_name: str
    total_recipients: int
    status: str


# Individual recipient result
class RecipientResponse(BaseModel):
    id: str
    name: str
    email: str
    status: str
    error_message: str | None = None

    model_config = ConfigDict(from_attributes=True)