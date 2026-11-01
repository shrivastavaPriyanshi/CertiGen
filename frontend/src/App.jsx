import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import CreateCertificates from './pages/CreateCertificates';
import GenerationHistory from './pages/GenerationHistory';
import JobDetails from './pages/JobDetails';
import CertificateManagement from './pages/CertificateManagement';
import NotFound from './pages/NotFound';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-navy-900 antialiased selection:bg-purple-100 selection:text-brand">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateCertificates />} />
            <Route path="/history" element={<GenerationHistory />} />
            <Route path="/history/:jobId" element={<JobDetails />} />
            <Route path="/certificates" element={<CertificateManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <JobProvider>
        <ToastProvider>
          <AppLayout />
        </ToastProvider>
      </JobProvider>
    </BrowserRouter>
  );
}
