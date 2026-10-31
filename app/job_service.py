import uuid

from pydantic import TypeAdapter, EmailStr, ValidationError
from sqlalchemy.orm import Session

from app.models import GenerationJob, Recipient
from app.database import SessionLocal
from app.schemas import GenerationJobCreate
from app.certificate_service import generate_certificate


# Email validator
email_adapter = TypeAdapter(EmailStr)


def validate_recipient(name: str, email: str):
    """
    Validate one recipient independently.
    Returns an error message if invalid.
    """

    name = name.strip()
    email = email.strip()

    if not name:
        return "Recipient name is required."

    if len(name) < 2:
        return "Recipient name must contain at least 2 characters."

    if not email:
        return "Email address is required."

    try:
        email_adapter.validate_python(email)
    except ValidationError:
        return "Invalid email address."

    return None


def create_generation_job(
    db: Session,
    request: GenerationJobCreate
):
    """
    Create a job and save all recipient records.
    """

    job = GenerationJob(
        id=str(uuid.uuid4()),
        event_name=request.event_name,
        completion_date=request.completion_date,
        total_recipients=len(request.recipients),
        successful_count=0,
        failed_count=0,
        status="queued"
    )

    db.add(job)
    db.flush()

    for recipient_data in request.recipients:

        name = recipient_data.name.strip()
        email = recipient_data.email.strip()

        error = validate_recipient(name, email)

        recipient = Recipient(
            id=str(uuid.uuid4()),
            job_id=job.id,
            name=name,
            email=email,
            status="failed" if error else "pending",
            error_message=error
        )

        db.add(recipient)

        if error:
            job.failed_count += 1

    db.commit()
    db.refresh(job)

    return job


def process_generation_job(job_id: str):
    """
    Process all valid recipients independently.
    """

    db = SessionLocal()

    try:
        job = db.query(GenerationJob).filter(
            GenerationJob.id == job_id
        ).first()

        if not job:
            return

        job.status = "processing"
        db.commit()

        recipients = db.query(Recipient).filter(
            Recipient.job_id == job_id,
            Recipient.status == "pending"
        ).all()

        for recipient in recipients:

            try:
                certificate_path = generate_certificate(
                    name=recipient.name,
                    event_name=job.event_name,
                    completion_date=job.completion_date,
                    certificate_id=recipient.id
                )

                recipient.status = "completed"
                recipient.certificate_path = certificate_path
                recipient.error_message = None

                job.successful_count += 1

            except Exception as error:

                recipient.status = "failed"
                recipient.error_message = str(error)

                job.failed_count += 1

            # Save each recipient's result independently
            db.commit()

        if job.failed_count > 0:
            job.status = "completed_with_errors"
        else:
            job.status = "completed"

        db.commit()

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()