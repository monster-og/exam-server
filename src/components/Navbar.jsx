import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  LogOut, 
  UserCheck, 
  Search,
  School,
  Bot
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, openNandu }) {
  const { role, user, logout } = useAuth();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(180deg, rgba(14, 12, 32, 0.95), rgba(8, 6, 20, 0.92))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          paddingBottom: '12px',
          gap: '16px',
        }}
      >
        {/* Brand Logo & School Title */}
        <div
          onClick={() => {
            if (role === 'student') setActivePage('student');
            else if (role === 'teacher') setActivePage('teacher');
            else if (role === 'admin') setActivePage('admin');
            else setActivePage('auth');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <School size={22} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '0.8px',
                color: '#fff',
                textTransform: 'uppercase',
                lineHeight: 1.2,
              }}
            >
              Oxford Convent School
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent-light)',
                fontWeight: 600,
                letterSpacing: '1px',
              }}
            >
              Sasaram • CBT Exam Portal
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {role === 'student' && (
            <>
              <button
                className={`btn ${activePage === 'student' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('student')}
              >
                <BookOpen size={16} /> Dashboard
              </button>
              <button
                className={`btn ${activePage === 'exam' ? 'btn-accent' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('exam')}
              >
                <GraduationCap size={16} /> Take Exam
              </button>
              <button
                className={`btn ${activePage === 'check-result' ? 'btn-surface' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('check-result')}
              >
                <Award size={16} /> Check Result
              </button>
              <button
                className="btn btn-ghost"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.86rem',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  background: 'rgba(56, 189, 248, 0.1)',
                  fontWeight: 700,
                }}
                onClick={openNandu}
                title="Ask Nandu — AI Doubt Solver"
              >
                <Bot size={16} color="#38bdf8" /> AI Tutor (Nandu)
              </button>
            </>
          )}

          {role === 'teacher' && (
            <>
              <button
                className={`btn ${activePage === 'teacher' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('teacher')}
              >
                <UserCheck size={16} /> Teacher Console
              </button>
              <button
                className={`btn ${activePage === 'check-result' ? 'btn-surface' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('check-result')}
              >
                <Search size={16} /> Result Lookup
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                className={`btn ${activePage === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('admin')}
              >
                <ShieldCheck size={16} /> Admin Center
              </button>
              <button
                className={`btn ${activePage === 'teacher' ? 'btn-surface' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('teacher')}
              >
                <UserCheck size={16} /> Faculty View
              </button>
              <button
                className={`btn ${activePage === 'check-result' ? 'btn-surface' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('check-result')}
              >
                <Award size={16} /> Results
              </button>
            </>
          )}

          {!role && (
            <>
              <button
                className={`btn ${activePage === 'auth' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('auth')}
              >
                <GraduationCap size={16} /> Portal Login
              </button>
              <button
                className={`btn ${activePage === 'check-result' ? 'btn-accent' : 'btn-surface'}`}
                style={{ padding: '8px 14px', fontSize: '0.86rem' }}
                onClick={() => setActivePage('check-result')}
              >
                <Award size={16} /> Show Result
              </button>
            </>
          )}

          {/* User Profile Pill & Logout */}
          {role && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '12px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                  {user?.name || (role === 'admin' ? 'Administrator' : 'Faculty')}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color:
                      role === 'admin'
                        ? '#fbbf24'
                        : role === 'teacher'
                        ? '#38bdf8'
                        : '#a78bfa',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {role === 'student' ? `Class ${user?.class || ''} (${user?.rollNumber || ''})` : role}
                </span>
              </div>

              <button
                className="btn btn-ghost"
                onClick={() => {
                  logout();
                  setActivePage('auth');
                }}
                title="Logout / Switch Account"
                style={{
                  padding: '8px',
                  color: 'var(--danger)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
