import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AlumniDirectory from './pages/AlumniDirectory';
import AlumniDetail from './pages/AlumniDetail';
import AlumniForm from './pages/AlumniForm';
import Login from './pages/Login';
import { Heart, GraduationCap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e293b',
            color: '#ffffff',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/directory" element={<AlumniDirectory />} />
          <Route path="/alumni/:id" element={<AlumniDetail />} />
          <Route
            path="/alumni/new"
            element={
              <ProtectedRoute>
                <AlumniForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni/:id/edit"
            element={
              <ProtectedRoute>
                <AlumniForm />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>AlumniConnect Portal • Built for MERN Stack Showcase</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>Powered by MongoDB, Express, React, and Node.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

