from datetime import date

import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models import GenerationJob, Recipient


@pytest.fixture
def client(tmp_path):

    # Create temporary test database
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )

    TestingSession = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # Create a sample PDF
    pdf_path = tmp_path / "test_certificate.pdf"
    pdf_path.write_bytes(b"%PDF-1.4 test certificate")

    # Insert sample job and recipient
    db = TestingSession()

    job = GenerationJob(
        id="test-job",
        event_name="Python Bootcamp",
        completion_date=date(2026, 11, 1),
        total_recipients=1,
        successful_count=1,
        failed_count=0,
        status="completed"
    )

    recipient = Recipient(
        id="test-cert",
        job_id="test-job",
        name="Priyanshi",
        email="priya@example.com",
        status="completed",
        certificate_path=str(pdf_path)
    )

    db.add_all([job, recipient])
    db.commit()
    db.close()

    yield TestClient(app)

    app.dependency_overrides.clear()
    engine.dispose()


def test_list_certificates(client):

    response = client.get(
        "/api/jobs/test-job/certificates"
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Priyanshi"


def test_download_certificate(client):

    response = client.get(
        "/api/certificates/test-cert/download"
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF-")


def test_download_invalid_certificate(client):

    response = client.get(
        "/api/certificates/invalid-id/download"
    )

    assert response.status_code == 404


def test_list_invalid_job(client):

    response = client.get(
        "/api/jobs/invalid-id/certificates"
    )

    assert response.status_code == 404