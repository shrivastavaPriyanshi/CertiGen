# CertiGen – Bulk Certificate Generator

A Python-based REST API that automates the generation of certificates in bulk using a predefined PDF template. CertiGen allows users to submit multiple recipient details in a single request, validate recipient information, track generation progress, and download generated certificates.

## 🚀 Features

- **Bulk Certificate Generation:** Generate certificates for multiple recipients through a single API request.
- **Input Validation:** Validate recipient names and email addresses.
- **PDF Generation:** Generate personalized PDF certificates using a predefined template.
- **Background Processing:** Process certificate generation asynchronously using FastAPI BackgroundTasks.
- **Job Tracking:** Track job status, total recipients, successful generations, and failures.
- **Individual Error Handling:** A failure for one recipient does not interrupt processing for other recipients.
- **Certificate Retrieval:** Retrieve certificate records associated with a generation job.
- **PDF Download:** Download successfully generated certificates through an API endpoint.
- **API Documentation:** Interactive API documentation using Swagger UI.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| SQLite | Relational database |
| SQLAlchemy | ORM and database operations |
| Pydantic | Request validation and data schemas |
| ReportLab | PDF certificate generation |
| Pytest | Automated testing |
| Uvicorn | ASGI server |

## 📁 Project Structure

```text
CertiGen/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── certificate_service.py
│   └── job_service.py
│
├── tests/
│   ├── test_validation.py
│   ├── test_generation.py
│   ├── test_status.py
│   └── test_download.py
│
├── templates/
├── generated_certificates/
│
├── requirements.txt
├── pytest.ini
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd CertiGen
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 5. Start the application

```bash
python -m uvicorn app.main:app --reload
```

The application will be available at:

`http://127.0.0.1:8000`

### 6. Open Swagger API Documentation

`http://127.0.0.1:8000/docs`

Use Swagger UI to interact with and test the available API endpoints.

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Home endpoint |
| GET | `/health` | Health check |
| POST | `/api/jobs` | Create a bulk certificate generation job |
| GET | `/api/jobs/{job_id}` | Retrieve job status and progress |
| GET | `/api/jobs/{job_id}/certificates` | Retrieve certificates associated with a job |
| GET | `/api/certificates/{certificate_id}/download` | Download a generated PDF certificate |

### Example: Create a Generation Job

**POST** `/api/jobs`

Request body:

```json
{
  "event_name": "Python Bootcamp 2026",
  "completion_date": "2026-11-01",
  "recipients": [
    {
      "name": "Priyanshi",
      "email": "priya@example.com"
    },
    {
      "name": "Rahul Sharma",
      "email": "rahul@example.com"
    },
    {
      "name": "Ananya Verma",
      "email": "ananya@example.com"
    }
  ]
}
```

Example response:

```json
{
  "job_id": "generated-job-id",
  "event_name": "Python Bootcamp 2026",
  "total_recipients": 3,
  "status": "queued"
}
```

Use the returned `job_id` to track progress and retrieve generated certificates.

## 📊 Job Processing Status

The application tracks the generation process using job and recipient statuses.

- `queued` – Job has been created.
- `processing` – Certificates are being generated.
- `completed` – All recipients were processed successfully.
- `completed_with_errors` – Processing finished with one or more failures.

Individual recipients are tracked as pending, completed, or failed.

## 🧪 Running Tests

Run the automated test suite using:

```bash
python -m pytest -v
```

The project currently includes **10 passing automated tests** covering:

- Request and recipient validation.
- Empty recipient list handling.
- Certificate PDF generation.
- Job status retrieval.
- Certificate listing.
- Certificate downloading.
- Invalid job and certificate IDs.

## 🔮 Future Improvements

- Integrate a durable task queue such as Celery with Redis for production-grade background processing.
- Add user authentication and authorization.
- Support customizable certificate templates.
- Add email delivery of generated certificates.
- Introduce an AI-powered assistant for natural-language certificate generation requests.

## 👩‍💻 Project Information

**Project:** CertiGen – Bulk Certificate Generator  
**Category:** Backend Development / REST API  
**Language:** Python  
**Framework:** FastAPI

