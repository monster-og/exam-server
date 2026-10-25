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
import NanduAiTutorModal from './components/NanduAiTutorModal';
import { School, Heart, Bot } from 'lucide-react';

function MainApp() {
  const { role, user, loading } = useAuth();
  const [activePage, setActivePage] = useState('auth');
  const [selectedExam, setSelectedExam] = useState(null);
  const [isNanduOpen, setIsNanduOpen] = useState(false);

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} openNandu={() => setIsNanduOpen(true)} />

      <main style={{ flex: 1 }}>
        {activePage === 'auth' && <AuthPage setActivePage={setActivePage} />}

        {activePage === 'student' && (
          <StudentDashboard
            setActivePage={setActivePage}
            setSelectedExam={setSelectedExam}
            openNandu={() => setIsNanduOpen(true)}
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

      {/* 🤖 Floating Nandu AI Tutor Launcher Button — ONLY VISIBLE AFTER STUDENT LOGS IN */}
      {role === 'student' && user && activePage !== 'auth' && (
        <>
          <button
            onClick={() => setIsNanduOpen(true)}
            className="nandu-fab-btn"
            title="Ask Nandu — AI Doubt Solver"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 998,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '50px',
              boxShadow: '0 10px 30px rgba(79, 70, 229, 0.6), 0 0 20px rgba(6, 182, 212, 0.5)',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.92rem',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
          >
            <span style={{ position: 'relative', display: 'flex' }}>
              <Bot size={22} color="#fff" />
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
            </span>
            <span>Ask Nandu (AI Tutor)</span>
          </button>

          {/* 🤖 Nandu AI Tutor Modal */}
          <NanduAiTutorModal
            isOpen={isNanduOpen}
            onClose={() => setIsNanduOpen(false)}
            studentClass={user?.class || 'Class 10'}
          />
        </>
      )}

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
