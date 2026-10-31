import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.database import Base


# Generation Job Table
class GenerationJob(Base):
    __tablename__ = "generation_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    event_name = Column(String, nullable=False)
    completion_date = Column(Date, nullable=False)

    total_recipients = Column(Integer, default=0)
    successful_count = Column(Integer, default=0)
    failed_count = Column(Integer, default=0)

    status = Column(String, default="queued")
    created_at = Column(DateTime, default=datetime.utcnow)

    recipients = relationship(
        "Recipient",
        back_populates="job",
        cascade="all, delete-orphan"
    )


# Recipient Table
class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    job_id = Column(
        String,
        ForeignKey("generation_jobs.id"),
        nullable=False
    )

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)

    status = Column(String, default="pending")

    certificate_path = Column(String, nullable=True)
    error_message = Column(String, nullable=True)

    job = relationship("GenerationJob", back_populates="recipients")