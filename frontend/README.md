# CertiGen — Modern React Frontend

A professional SaaS dashboard for bulk certificate generation, built with **React**, **Vite**, **Tailwind CSS**, and **React Router**, seamlessly integrated with the FastAPI backend.

## 🚀 Key Features

1. **Overview Dashboard**
   - High-level KPI metrics (Total Jobs, Total Certificates Generated, Successful & Failed Batches).
   - Recent generation activity with visual progress bars.
   - Quick one-click action to initiate bulk generation.

2. **Create Bulk Certificates**
   - Event metadata configuration (Event Name, Completion Date).
   - Dual input modalities:
     - **Manual Entry**: Dynamic row creation/removal, 1-click sample data autofill, and live field validation.
     - **CSV Upload**: Drag-and-drop file ingestion, automatic column mapping (`Name`, `Email`), and sample template download.
   - Real-time pre-flight validation summary before submitting batch requests.

3. **Generation History**
   - Searchable and filterable job table (by event name, job ID, and execution status).
   - Visual progress bars showing completed vs. failed recipients.
   - Background polling for active jobs (`queued` / `processing`).

4. **Job Execution Details (`/history/:jobId`)**
   - Detailed job metrics (Total, Successful, Failed, Pending).
   - Recipient log table with individual status badges and error reason inspection.
   - In-browser PDF certificate preview modal with zoom/new tab options.
   - Single-click PDF certificate downloads.

5. **Certificate Explorer (`/certificates`)**
   - Explorer across all batches or by specific event.
   - Live search by recipient name or email.
   - Filter by status (Completed, Failed, Pending).

## 🛠️ Development Setup

### 1. Ensure the FastAPI Backend is Running

In the root project directory:
```bash
.\venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```
Backend will be available at: `http://127.0.0.1:8000` (Swagger docs at `/docs`).

### 2. Start the Frontend Development Server

Inside the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. All API calls (`/api/*` and `/health`) are automatically proxied to the backend via Vite.

### 3. Build for Production

```bash
npm run build
```
Generates optimized static assets in `frontend/dist/`.
