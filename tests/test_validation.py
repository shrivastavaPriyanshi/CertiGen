import pytest
from pydantic import ValidationError

from app.schemas import GenerationJobCreate


def test_valid_generation_request():

    data = {
        "event_name": "Python Bootcamp 2026",
        "completion_date": "2026-10-31",
        "recipients": [
            {
                "name": "Priyanshi Sharma",
                "email": "priya@example.com"
            }
        ]
    }

    request = GenerationJobCreate(**data)

    assert request.event_name == "Python Bootcamp 2026"
    assert len(request.recipients) == 1


def test_invalid_email():

    data = {
        "event_name": "Python Bootcamp 2026",
        "completion_date": "2026-10-31",
        "recipients": [
            {
                "name": "Priyanshi Sharma",
                "email": "invalid-email"
            }
        ]
    }

    with pytest.raises(ValidationError):
        GenerationJobCreate(**data)


def test_empty_recipients():

    data = {
        "event_name": "Python Bootcamp 2026",
        "completion_date": "2026-10-31",
        "recipients": []
    }

    with pytest.raises(ValidationError):
        GenerationJobCreate(**data)