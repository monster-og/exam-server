import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  KeyRound, 
  RefreshCw, 
  ArrowRight, 
  School,
  Lock,
  Phone,
  Hash
} from 'lucide-react';

const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

const SECTIONS = ['A', 'B', 'C', 'D'];

export default function AuthPage({ setActivePage }) {
  const { loginStudent, loginStaff } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('student-login'); // 'student-login' | 'student-register' | 'teacher' | 'admin'
  const [loading, setLoading] = useState(false);

  // Student Login State
  const [loginRoll, setLoginRoll] = useState('');
  const [loginClass, setLoginClass] = useState('Class 10');
  const [loginPass, setLoginPass] = useState('');

  // Student Register State
  const [regName, setRegName] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regClass, setRegClass] = useState('Class 10');
  const [regSection, setRegSection] = useState('A');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regCaptchaInput, setRegCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');

  // Teacher / Admin Password
  const [teacherPass, setTeacherPass] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: verify, 2: reset
  const [forgotRoll, setForgotRoll] = useState('');
  const [forgotClass, setForgotClass] = useState('Class 10');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');

  // Generate random captcha
  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(code);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  // 1. Handle Student Login
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!loginRoll || !loginClass || !loginPass) {
      showToast('Please fill all login fields', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await api.studentLogin({
        rollNumber: loginRoll.trim(),
        classNumber: loginClass,
        password: loginPass,
      });

      if (res.success && res.token) {
        loginStudent(res.token, res.student);
        showToast(`Welcome back, ${res.student.name}!`, 'success');
        setActivePage('student');
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Invalid Roll Number or Password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Student Registration
  const handleStudentRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regRoll || !regClass || !regPass || !regPhone) {
      showToast('All registration fields are required', 'warning');
      return;
    }

    if (regCaptchaInput.trim().toUpperCase() !== generatedCaptcha) {
      showToast('Invalid Captcha code! Please check and retry', 'error');
      refreshCaptcha();
      setRegCaptchaInput('');
      return;
    }

    setLoading(true);
    try {
      const res = await api.studentRegister({
        name: regName.trim(),
        rollNumber: regRoll.trim(),
        classNumber: regClass,
        section: regSection,
        phone: regPhone.trim(),
        password: regPass,
      });

      if (res.success && res.token) {
        loginStudent(res.token, res.student);
        showToast('Registration successful! Welcome to the Examination Portal.', 'success');
        setActivePage('student');
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Could not register student account', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Teacher Login
  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    if (!teacherPass) {
      showToast('Please enter faculty password', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await api.teacherLogin(teacherPass);
      if (res.success && res.token) {
        loginStaff(res.token, 'teacher', { name: 'Faculty Member', role: 'teacher' });
        showToast('Faculty login authenticated!', 'success');
        setActivePage('teacher');
      } else {
        showToast(res.message || 'Invalid faculty password', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Invalid Teacher Credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminPass) {
      showToast('Please enter administrator password', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await api.adminLogin(adminPass);
      if (res.success && res.token) {
        loginStaff(res.token, 'admin', { name: 'Principal / Administrator', role: 'admin' });
        showToast('Administrator console unlocked!', 'success');
        setActivePage('admin');
      } else {
        showToast(res.message || 'Invalid admin password', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Invalid Admin Credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Forgot Password Verify
  const handleForgotVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.verifyForgotPassword({
        rollNumber: forgotRoll.trim(),
        classNumber: forgotClass,
        phone: forgotPhone.trim(),
      });
      if (res.success) {
        showToast('Identity verified! Set your new password.', 'success');
        setForgotStep(2);
      } else {
        showToast(res.message || 'Verification failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Record not matched', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Forgot Password Reset
  const handleForgotReset = async (e) => {
    e.preventDefault();
    if (!forgotNewPass || forgotNewPass.length < 4) {
      showToast('Password must be at least 4 characters', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetForgotPassword({
        rollNumber: forgotRoll.trim(),
        classNumber: forgotClass,
        phone: forgotPhone.trim(),
        newPassword: forgotNewPass,
      });
      if (res.success) {
        showToast('Password reset successfully! Please login now.', 'success');
        setShowForgotModal(false);
        setForgotStep(1);
        setActiveTab('student-login');
      } else {
        showToast(res.message || 'Failed to update password', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ padding: '30px 20px', minHeight: 'calc(100vh - 80px)' }}>
      {/* Grand Title Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="school-badge">
          <School size={16} /> Oxford Convent School • Sasaram
        </div>
        <h1 className="grand-title" style={{ marginTop: '10px' }}>
          Computer Based Examination Portal
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          State-of-the-Art CBT Assessment, Periodic Test Evaluation &amp; Immediate Result Verification System
        </p>
      </div>

      {/* Main Authentication Card */}
      <div
        className="glass-card"
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          padding: '32px 28px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
        }}
      >
        {/* Top Role Selector Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(14, 12, 34, 0.8)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            gap: '4px',
          }}
        >
          <button
            className={`btn ${activeTab.startsWith('student') ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '9px 4px', fontSize: '0.86rem' }}
            onClick={() => setActiveTab('student-login')}
          >
            <GraduationCap size={16} /> Student
          </button>
          <button
            className={`btn ${activeTab === 'teacher' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '9px 4px', fontSize: '0.86rem' }}
            onClick={() => setActiveTab('teacher')}
          >
            <UserCheck size={16} /> Teacher
          </button>
          <button
            className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '9px 4px', fontSize: '0.86rem' }}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        {/* Student Sub-switch (Login vs Register) */}
        {activeTab.startsWith('student') && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '12px',
              marginBottom: '22px',
            }}
          >
            <button
              onClick={() => setActiveTab('student-login')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'student-login' ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.96rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'student-login' ? '2px solid var(--accent)' : 'none',
                paddingBottom: '4px',
                transition: 'all 0.2s',
              }}
            >
              <LogIn size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Student Login
            </button>
            <button
              onClick={() => {
                setActiveTab('student-register');
                refreshCaptcha();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'student-register' ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.96rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'student-register' ? '2px solid var(--accent)' : 'none',
                paddingBottom: '4px',
                transition: 'all 0.2s',
              }}
            >
              <UserPlus size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Register New Account
            </button>
          </div>
        )}

        {/* ── Form 1: Student Login ── */}
        {activeTab === 'student-login' && (
          <form onSubmit={handleStudentLogin}>
            <div className="form-group">
              <label className="form-label">
                <Hash size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Student Roll Number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter assigned roll number (e.g. 101)"
                value={loginRoll}
                onChange={(e) => setLoginRoll(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <School size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Select Class / Grade
              </label>
              <select
                className="form-control"
                value={loginClass}
                onChange={(e) => setLoginClass(e.target.value)}
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">
                  <Lock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Account Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '8px',
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ── Form 2: Student Registration ── */}
        {activeTab === 'student-register' && (
          <form onSubmit={handleStudentRegister}>
            <div className="form-group">
              <label className="form-label">Full Name of Student</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Priya Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 101"
                  value={regRoll}
                  onChange={(e) => setRegRoll(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Class</label>
                <select
                  className="form-control"
                  value={regClass}
                  onChange={(e) => setRegClass(e.target.value)}
                >
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Section</label>
                <select
                  className="form-control"
                  value={regSection}
                  onChange={(e) => setRegSection(e.target.value)}
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Parent mobile number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Create Secure Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimum 4 characters"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                required
              />
            </div>

            {/* Visual Captcha Security Box */}
            <div className="form-group">
              <label className="form-label">Security Verification</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                    border: '1px dashed var(--primary-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 16px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '5px',
                    color: '#38bdf8',
                    userSelect: 'none',
                    textDecoration: 'line-through',
                  }}
                >
                  {generatedCaptcha}
                </div>
                <button
                  type="button"
                  className="btn btn-surface"
                  onClick={refreshCaptcha}
                  style={{ padding: '8px 12px' }}
                  title="Generate new captcha code"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Type the 5 characters above"
                value={regCaptchaInput}
                onChange={(e) => setRegCaptchaInput(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Registering Account...' : 'Complete Registration'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ── Form 3: Teacher Portal Login ── */}
        {activeTab === 'teacher' && (
          <form onSubmit={handleTeacherLogin}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👨‍🏫</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Faculty / Teacher Access</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Create question papers, review exams, and grade students
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Authorized Faculty Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter teacher master password"
                value={teacherPass}
                onChange={(e) => setTeacherPass(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Verifying Faculty Access...' : 'Unlock Teacher Dashboard'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ── Form 4: Admin Portal Login ── */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🛡️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Administrator Cockpit</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                System-wide controls, Excel export, and result publication
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Principal / Master Admin Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter administrator password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating Admin...' : 'Enter Admin Center'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Quick link to Result Verification */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <button
            onClick={() => setActivePage('check-result')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-light)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🎯 Looking to check published results? Click here for Result Verification
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                <KeyRound size={18} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--accent)' }} />
                Student Password Recovery
              </h3>
              <button
                className="btn btn-ghost"
                onClick={() => setShowForgotModal(false)}
                style={{ padding: '4px' }}
              >
                ✕
              </button>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotVerify}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '16px' }}>
                  Verify your registered credentials to reset your exam portal password.
                </p>

                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Roll Number"
                    value={forgotRoll}
                    onChange={(e) => setForgotRoll(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select
                    className="form-control"
                    value={forgotClass}
                    onChange={(e) => setForgotClass(e.target.value)}
                  >
                    {CLASSES.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Registered Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Registered mobile number"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{ width: '100%', padding: '12px' }}
                  disabled={loading}
                >
                  {loading ? 'Verifying Account...' : 'Verify Identity'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotReset}>
                <p style={{ color: 'var(--success)', fontSize: '0.86rem', marginBottom: '16px' }}>
                  ✅ Identity verified successfully! Please enter your new password.
                </p>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="At least 4 characters"
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                  disabled={loading}
                >
                  {loading ? 'Updating Password...' : 'Save New Password & Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
