# CertiGen – Bulk Certificate Generator

**A Python-based REST API for automated bulk PDF certificate generation.**

CertiGen is a backend application built with FastAPI that simplifies the process of generating certificates for multiple recipients. It accepts bulk recipient information through a single API request, validates individual records, generates personalized PDF certificates, and tracks the progress of each generation job.

The application uses background processing and individual error handling to ensure that an invalid recipient does not interrupt certificate generation for other recipients.

---

## ✨ Key Features

- **Bulk Generation:** Submit multiple recipients in a single API request.
- **Recipient Validation:** Validate recipient names and email addresses before generating certificates.
- **Automated PDF Generation:** Create personalized PDF certificates programmatically using ReportLab.
- **Background Processing:** Process certificate generation asynchronously using FastAPI BackgroundTasks.
- **Job Tracking:** Monitor generation status, total recipients, successful certificates, and failed records.
- **Individual Error Handling:** Handle recipient-level failures without stopping the entire generation process.
- **Certificate Management:** Retrieve certificate records associated with a generation job.
- **PDF Downloads:** Download successfully generated certificates through dedicated API endpoints.
- **Interactive API Documentation:** Explore and test endpoints using Swagger UI.

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| SQLite | Relational database |
| SQLAlchemy | Database ORM |
| Pydantic | Request validation and data schemas |
| ReportLab | PDF certificate generation |
| Pytest | Automated testing |
| Uvicorn | ASGI application server |

## 🏗️ Project Architecture

```text
Client / Swagger UI
        |
        v
    FastAPI
        |
        v
   API Endpoints
        |
        v
   Job Service
        |
        +----------------------+
        |                      |
        v                      v
Recipient Validation     Background Processing
                               |
                               v
                       Certificate Service
                               |
                               v
                         ReportLab PDF
                               |
                               v
                     Generated Certificates
                               |
                               v
                         SQLite Database
```

## 📁 Project Structure

```text
CertiGen/
│
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application and API routes
│   ├── database.py             # Database connection and session
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic request and response schemas
│   ├── certificate_service.py  # PDF certificate generation
│   └── job_service.py          # Job creation, validation and processing
│
├── tests/
│   ├── test_validation.py      # Input validation tests
│   ├── test_generation.py      # Certificate generation tests
│   ├── test_status.py          # Job status tests
│   └── test_download.py        # Certificate listing and download tests
│
├── templates/                  # Template assets, if used
├── generated_certificates/     # Generated PDF output
│
├── requirements.txt
├── pytest.ini
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10 or later
- Git
- Visual Studio Code or another code editor

### 1. Clone the repository

```bash
git clone https://github.com/shrivastavaPriyanshi/CertiGen.git
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

**macOS / Linux:**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 5. Run the application

```bash
python -m uvicorn app.main:app --reload
```

The API server will start at:

`http://127.0.0.1:8000`

### 6. Access API documentation

Open Swagger UI in your browser:

`http://127.0.0.1:8000/docs`

You can explore endpoints, submit requests, and test API responses directly through the interactive documentation.

---

## 📡 API Documentation

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Application welcome endpoint |
| GET | `/health` | Health check |
| POST | `/api/jobs` | Create a bulk certificate generation job |
| GET | `/api/jobs/{job_id}` | Retrieve job status and progress |
| GET | `/api/jobs/{job_id}/certificates` | Retrieve certificates associated with a job |
| GET | `/api/certificates/{certificate_id}/download` | Download a generated PDF certificate |

### 1. Create a Generation Job

**POST** `/api/jobs`

Example request:

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

The API returns a job ID that can be used to track generation progress and retrieve certificates.

### 2. Track Generation Status

**GET** `/api/jobs/{job_id}`

Returns:
- Job information
- Total recipients
- Successful certificate count
- Failed recipient count
- Pending recipient count
- Overall job status
- Individual recipient records

### 3. Retrieve Generated Certificates

**GET** `/api/jobs/{job_id}/certificates`

Returns recipient and certificate information associated with the specified job.

### 4. Download a Certificate

**GET** `/api/certificates/{certificate_id}/download`

Returns the generated certificate as a PDF file when generation has completed successfully.

---

## 📊 Job and Recipient Status

### Job Status

| Status | Description |
|---|---|
| `queued` | Job has been created and is awaiting processing. |
| `processing` | Certificate generation is in progress. |
| `completed` | All recipients were processed successfully. |
| `completed_with_errors` | Processing finished with one or more recipient failures. |

### Recipient Status

| Status | Description |
|---|---|
| `pending` | Certificate generation is awaiting processing. |
| `completed` | Certificate was generated successfully. |
| `failed` | Validation or certificate generation failed. |

## 🧪 Testing

CertiGen includes automated tests using Pytest.

Run the test suite:

```bash
python -m pytest -v
```

### Test Coverage

- Valid generation request
- Invalid email validation
- Empty recipient list validation
- Empty recipient name validation
- PDF certificate generation
- Job status endpoint
- Certificate listing endpoint
- Successful certificate download
- Invalid certificate ID handling
- Invalid job ID handling

**Latest local test result: 10 passed.**

## 🔒 Error Handling and Reliability

- Recipient information is validated individually.
- Invalid recipient records are marked as failed.
- Certificate generation continues for other valid recipients.
- Job-level progress and recipient-level results are stored in the database.
- Missing jobs, certificates, or unavailable PDF files return appropriate HTTP error responses.

## 🚀 Future Enhancements

Potential improvements for future versions:

- Email delivery of generated certificates.
- Customizable certificate designs and templates.
- User authentication and role-based access control.
- Certificate verification using unique IDs or QR codes.
- Durable background processing using Celery and Redis.
- AI-powered assistant for natural-language certificate generation requests.

## 👩‍💻 Author

**Priyanshi Shrivastava**

B.Tech – Computer Science and Engineering

- GitHub: [@shrivastavaPriyanshi](https://github.com/shrivastavaPriyanshi)
- Project Repository: [CertiGen](https://github.com/shrivastavaPriyanshi/CertiGen)

---

*Built with Python and FastAPI to simplify bulk certificate generation.*


