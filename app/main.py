from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.models import GenerationJob, Recipient
from app.schemas import JobStatusResponse
from pathlib import Path

from fastapi.responses import FileResponse
from app.schemas import RecipientResponse
from fastapi import Depends, BackgroundTasks, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import GenerationJobCreate, GenerationJobResponse
from app.job_service import (
    create_generation_job,
    process_generation_job
)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bulk Certificate Generator",
    description="API for generating certificates in bulk",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Bulk Certificate Generator API!",
        "status": "Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@app.post(
    "/api/jobs",
    response_model=GenerationJobResponse,
    status_code=status.HTTP_202_ACCEPTED
)
def create_job(
    request: GenerationJobCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):

    try:
        # Save the job and recipients
        job = create_generation_job(db, request)

        # Start background processing
        background_tasks.add_task(
            process_generation_job,
            job.id
        )

        return {
            "job_id": job.id,
            "event_name": job.event_name,
            "total_recipients": job.total_recipients,
            "status": job.status
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not create generation job: {str(error)}"
        )
@app.get(
    "/api/jobs/{job_id}",
    response_model=JobStatusResponse
)
def get_job_status(
    job_id: str,
    db: Session = Depends(get_db)
):

    # Find the generation job
    job = db.query(GenerationJob).filter(
        GenerationJob.id == job_id
    ).first()

    # Check whether job exists
    if not job:
        raise HTTPException(
            status_code=404,
            detail="Generation job not found"
        )

    # Get all recipients associated with this job
    recipients = db.query(Recipient).filter(
        Recipient.job_id == job_id
    ).all()

    # Calculate pending recipients
    pending_count = (
        job.total_recipients
        - job.successful_count
        - job.failed_count
    )

    return {
        "job_id": job.id,
        "event_name": job.event_name,
        "completion_date": job.completion_date,
        "total_recipients": job.total_recipients,
        "successful_count": job.successful_count,
        "failed_count": job.failed_count,
        "pending_count": pending_count,
        "status": job.status,
        "recipients": recipients
    }

@app.get(
    "/api/jobs/{job_id}/certificates",
    response_model=list[RecipientResponse]
)
def get_job_certificates(
    job_id: str,
    db: Session = Depends(get_db)
):

    # Check whether job exists
    job = db.query(GenerationJob).filter(
        GenerationJob.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Generation job not found"
        )

    # Retrieve all recipients of this job
    recipients = db.query(Recipient).filter(
        Recipient.job_id == job_id
    ).all()

    return recipients

@app.get("/api/certificates/{certificate_id}/download")
def download_certificate(
    certificate_id: str,
    db: Session = Depends(get_db)
):

    # Find recipient record
    recipient = db.query(Recipient).filter(
        Recipient.id == certificate_id
    ).first()

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found"
        )

    # Check generation status
    if recipient.status != "completed":
        raise HTTPException(
            status_code=404,
            detail="Certificate has not been generated successfully"
        )

    # Get certificate file path
    file_path = Path(recipient.certificate_path)

    # Check whether PDF exists
    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Certificate file not found"
        )

    # Return PDF file
    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename=f"certificate_{recipient.id}.pdf"
    )