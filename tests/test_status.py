from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_invalid_job_status():

    response = client.get(
        "/api/jobs/invalid-job-id"
    )

    assert response.status_code == 404

    assert response.json() == {
        "detail": "Generation job not found"
    }