from datetime import date
from pydantic import BaseModel, Field, ConfigDict


class RecipientCreate(BaseModel):
    name: str = Field(default="", max_length=100)
    email: str = Field(default="", max_length=254)


class GenerationJobCreate(BaseModel):
    event_name: str = Field(min_length=3, max_length=150)
    completion_date: date
    recipients: list[RecipientCreate] = Field(
        min_length=1,
        max_length=1000
    )


class GenerationJobResponse(BaseModel):
    job_id: str
    event_name: str
    total_recipients: int
    status: str


class RecipientResponse(BaseModel):
    id: str
    name: str
    email: str
    status: str
    error_message: str | None = None

    model_config = ConfigDict(from_attributes=True)

class JobStatusResponse(BaseModel):
    job_id: str
    event_name: str
    completion_date: date

    total_recipients: int
    successful_count: int
    failed_count: int
    pending_count: int

    status: str
    recipients: list[RecipientResponse]