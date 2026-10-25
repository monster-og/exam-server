import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import ExamPortal from './pages/ExamPortal';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CheckResultPage from './pages/CheckResultPage';
import { School, Heart } from 'lucide-react';

function MainApp() {
  const { role, loading } = useAuth();
  const [activePage, setActivePage] = useState('auth');
  const [selectedExam, setSelectedExam] = useState(null);

  // Sync active page with authentication role
  useEffect(() => {
    if (!loading) {
      if (role === 'student' && activePage === 'auth') {
        setActivePage('student');
      } else if (role === 'teacher' && activePage === 'auth') {
        setActivePage('teacher');
      } else if (role === 'admin' && activePage === 'auth') {
        setActivePage('admin');
      }
    }
  }, [role, loading]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTop: '3px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
          Connecting to Oxford Convent Examination Portal...
        </div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main style={{ flex: 1 }}>
        {activePage === 'auth' && <AuthPage setActivePage={setActivePage} />}

        {activePage === 'student' && (
          <StudentDashboard
            setActivePage={setActivePage}
            setSelectedExam={setSelectedExam}
          />
        )}

        {activePage === 'exam' && (
          <ExamPortal
            setActivePage={setActivePage}
            selectedExam={selectedExam}
            setSelectedExam={setSelectedExam}
          />
        )}

        {activePage === 'teacher' && <TeacherDashboard setActivePage={setActivePage} />}

        {activePage === 'admin' && <AdminDashboard setActivePage={setActivePage} />}

        {activePage === 'check-result' && <CheckResultPage setActivePage={setActivePage} />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(7, 5, 19, 0.95)',
          padding: '24px 20px',
          textAlign: 'center',
          fontSize: '0.84rem',
          color: 'var(--text-dim)',
        }}
      >
        <div className="app-container" style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <School size={16} color="var(--accent)" />
            <strong style={{ color: '#fff' }}>Oxford Convent School, Sasaram</strong>
          </div>
          <div>
            Recognized CBSE Pattern Online Examination &amp; Evaluation Engine • All Rights Reserved © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
