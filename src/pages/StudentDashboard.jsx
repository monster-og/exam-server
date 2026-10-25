import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import AnswersheetModal from '../components/AnswersheetModal';
import A4MarksheetModal from '../components/A4MarksheetModal';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  Calendar, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Play, 
  User, 
  Edit3, 
  Sparkles,
  Phone,
  Hash,
  Bot
} from 'lucide-react';

const PT_TABS = [
  { id: 'all', label: 'All Exams' },
  { id: 'PT-1', label: 'Periodic Test 1 (PT-1)' },
  { id: 'PT-2', label: 'Periodic Test 2 (PT-2)' },
  { id: 'PT-3', label: 'Periodic Test 3 (PT-3)' },
  { id: 'PT-4', label: 'Periodic Test 4 (PT-4)' },
  { id: 'Class Test', label: '📝 Class Tests' },
];

export default function StudentDashboard({ setActivePage, setSelectedExam, openNandu }) {
  const { user, updateStudent } = useAuth();
  const { showToast } = useToast();

  const [activePtTab, setActivePtTab] = useState('all');
  const [availableExams, setAvailableExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);

  // Modals
  const [selectedAnswersheet, setSelectedAnswersheet] = useState(null);
  const [selectedMarksheet, setSelectedMarksheet] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSection, setProfileSection] = useState(user?.section || 'A');

  // Load available exams and results for current student
  useEffect(() => {
    if (!user) return;

    // Load available tests
    async function loadExams() {
      setLoadingExams(true);
      try {
        const studentClass = user.class || 'Class 10';
        const res = await api.getQuestions({ class: studentClass });
        if (res.success && res.questions) {
          // Group or format questions by subject
          setAvailableExams(res.questions);
        } else {
          setAvailableExams([]);
        }
      } catch (err) {
        console.error('Failed to load exams', err);
      } finally {
        setLoadingExams(false);
      }
    }

    // Load results
    async function loadResults() {
      setLoadingResults(true);
      try {
        const res = await api.getStudentResults();
        if (res.success && res.results) {
          setExamResults(res.results);
        } else {
          setExamResults([]);
        }
      } catch (err) {
        console.error('Failed to load results', err);
      } finally {
        setLoadingResults(false);
      }
    }

    loadExams();
    loadResults();
  }, [user]);

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateStudentProfile({
        phone: profilePhone,
        section: profileSection,
      });
      if (res.success) {
        updateStudent({ phone: profilePhone, section: profileSection });
        showToast('Profile updated successfully!', 'success');
        setShowEditProfile(false);
      } else {
        showToast(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating profile', 'error');
    }
  };

  // Launch Exam
  const handleLaunchExam = (exam) => {
    if (setSelectedExam) {
      setSelectedExam({
        subject: exam.subject,
        cls: user.class,
        examType: exam.examType || (activePtTab !== 'all' ? activePtTab : 'PT-1'),
        session: exam.session || '2025-2026',
        timeLimit: exam.timeLimit || 30,
      });
    }
    setActivePage('exam');
  };

  // View A4 Marksheet
  const handleViewMarksheet = async (resItem) => {
    try {
      showToast('Generating official CBSE marksheet...', 'info', 2000);
      const params = {
        name: user?.name,
        cls: user?.class,
        session: resItem.session || resItem.year || '2025-2026',
        examType: resItem.examType || 'PT-1',
      };
      const res = await api.getCumulativeMarksheet(params);
      if (res && res.success && res.marksheet) {
        setSelectedMarksheet(res);
      } else {
        // Fallback to single result sheet
        setSelectedMarksheet({
          marksheet: {
            student: user,
            totals: {
              maxMarks: resItem.total,
              securedMarks: resItem.score,
              percentage: resItem.total ? Math.round((resItem.score / resItem.total) * 100) : 0,
              grade: (resItem.score / resItem.total) >= 0.8 ? 'A1' : 'B1',
              status: (resItem.score / resItem.total) >= 0.4 ? 'PASSED' : 'NEEDS REVISION',
            },
            subjects: [{
              subject: resItem.subject,
              maxMarks: resItem.total,
              passingMarks: Math.round(resItem.total * 0.4),
              securedMarks: resItem.score,
              grade: 'A',
            }],
            session: resItem.session || '2025-2026',
            examType: resItem.examType || 'Class Test',
          }
        });
      }
    } catch (err) {
      showToast('Could not load marksheet', 'error');
    }
  };

  // KPI Calculations
  const completedCount = examResults.length;
  const avgScore = completedCount > 0
    ? Math.round(examResults.reduce((acc, r) => acc + (r.total ? (r.score / r.total) * 100 : 0), 0) / completedCount)
    : 0;

  // Filter results by PT tab
  const filteredResults = activePtTab === 'all'
    ? examResults
    : examResults.filter((r) => r.examType === activePtTab || (activePtTab === 'Class Test' && (r.examType === 'Class Test' || r.examType === 'CT')));

  return (
    <div className="app-container" style={{ paddingBottom: '60px' }}>
      {/* ── Student Profile Header Banner ── */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          marginBottom: '26px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.22), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            👨‍🎓
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                {user?.name || 'Student Candidate'}
              </h2>
              <span className="badge badge-accent">Verified Student</span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                flexWrap: 'wrap',
              }}
            >
              <span>🎓 <strong>{user?.class || 'Class 10'}</strong> (Sec {user?.section || 'A'})</span>
              <span>🔢 Roll No: <strong>{user?.rollNumber || '-'}</strong></span>
              <span>📱 Phone: <strong>{user?.phone || 'Not linked'}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-surface"
            onClick={() => setShowEditProfile(true)}
            style={{ fontSize: '0.86rem' }}
          >
            <Edit3 size={15} /> Edit Contact
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setActivePage('exam')}
            style={{ fontSize: '0.86rem' }}
          >
            <Play size={15} /> Take Live Exam
          </button>
        </div>
      </div>

      {/* ── 🤖 Nandu AI Tutor Feature Banner ── */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          marginBottom: '26px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.22), rgba(6, 182, 212, 0.16), rgba(16, 185, 129, 0.12))',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.85rem',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              flexShrink: 0,
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                Got Doubts in Any Subject? Ask Nandu AI Tutor!
              </h3>
              <span className="badge badge-accent" style={{ background: 'rgba(6, 182, 212, 0.25)', color: '#67e8f9', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                24/7 Academic Solver
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Instant step-by-step solutions for <strong>Mathematics, Science, English, SST &amp; Computer</strong> with formulas, worked examples, and visual diagrams.
            </p>
          </div>
        </div>

        <button
          onClick={openNandu}
          className="btn btn-primary"
          style={{
            padding: '11px 22px',
            fontSize: '0.92rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 18px rgba(79, 70, 229, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <Bot size={18} /> Ask Nandu Now
        </button>
      </div>

      {/* ── Key Stats KPI Row ── */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{completedCount}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>
            Assessments Taken
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>{avgScore}%</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>
            Average Performance
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)' }}>
            {avgScore >= 80 ? 'Grade A1' : avgScore >= 60 ? 'Grade B1' : avgScore >= 40 ? 'Grade C1' : 'Grade D'}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>
            Evaluation Rank
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-light)' }}>
            {availableExams.length}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>
            Available Question Papers
          </div>
        </div>
      </div>

      {/* ── Periodic Test Filter Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '6px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          overflowX: 'auto',
          marginBottom: '28px',
        }}
      >
        {PT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePtTab(tab.id)}
            className={`btn ${activePtTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              padding: '10px 18px',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Available Exams Section ── */}
      <div style={{ marginBottom: '38px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
            📚 Available Exams for {user?.class || 'Your Class'}
          </h3>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Tap any paper to commence test session
          </span>
        </div>

        {loadingExams ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading available question papers...
          </div>
        ) : availableExams.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            <BookOpen size={40} style={{ opacity: 0.4, marginBottom: '10px' }} />
            <h4>No active question papers uploaded yet</h4>
            <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
              Your teacher will schedule and upload examination papers here shortly.
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {availableExams.map((exam, i) => (
              <div
                key={i}
                className="glass-card glass-card-interactive"
                style={{ padding: '22px' }}
                onClick={() => handleLaunchExam(exam)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{exam.examType || (activePtTab !== 'all' ? activePtTab : 'Periodic Test')}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-light)', fontWeight: 600 }}>
                    {exam.session || '2025-2026'}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                  {exam.subject}
                </h4>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Standard CBSE Syllabus • {exam.questions?.length || exam.count || '15+'} Questions
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '12px',
                    fontSize: '0.84rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                    <Clock size={14} /> {exam.timeLimit || 30} Minutes
                  </span>
                  <span className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    Start Exam <Play size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submissions & Past Results Table ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              📋 My Exam History &amp; Official Scorecards
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Answer sheets are accessible immediately. Full marksheets available upon evaluation.
            </p>
          </div>
        </div>

        {loadingResults ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading result history...
          </div>
        ) : filteredResults.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            <Award size={40} style={{ opacity: 0.4, marginBottom: '10px' }} />
            <h4>No submissions found for selected filter</h4>
            <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
              Take an examination above to view results and solutions here.
            </p>
          </div>
        ) : (
          <div className="custom-table-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Test Type</th>
                  <th>Session</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Score / Total</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Solutions &amp; Reports</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r, i) => {
                  const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                  const isPassed = pct >= 40;
                  const dt = r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : '-';

                  return (
                    <tr key={r.id || i}>
                      <td><strong>{i + 1}</strong></td>
                      <td>
                        <span className="badge badge-primary">{r.examType || 'PT-1'}</span>
                      </td>
                      <td><span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{r.session || r.year || '2025-2026'}</span></td>
                      <td><strong style={{ color: '#fff' }}>{r.subject}</strong></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>{dt}</td>
                      <td>
                        <strong style={{ color: 'var(--primary-light)', fontSize: '1rem' }}>
                          {r.score} / {r.total}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: isPassed ? 'var(--success)' : 'var(--danger)' }}>
                          {pct}%
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
                          {isPassed ? 'Passed' : 'Needs Work'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-surface"
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                            onClick={() => setSelectedAnswersheet(r)}
                          >
                            🔑 Answer Sheet
                          </button>
                          <button
                            className="btn btn-accent"
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                            onClick={() => handleViewMarksheet(r)}
                          >
                            📄 Marksheet
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Answer Sheet Solution Modal */}
      {selectedAnswersheet && (
        <AnswersheetModal
          result={selectedAnswersheet}
          onClose={() => setSelectedAnswersheet(null)}
        />
      )}

      {/* A4 Printable Marksheet Modal */}
      {selectedMarksheet && (
        <A4MarksheetModal
          marksheetData={selectedMarksheet}
          onClose={() => setSelectedMarksheet(null)}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal-backdrop" onClick={() => setShowEditProfile(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              Update Student Contact Details
            </h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="form-control"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Class Section</label>
                <select
                  className="form-control"
                  value={profileSection}
                  onChange={(e) => setProfileSection(e.target.value)}
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditProfile(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
