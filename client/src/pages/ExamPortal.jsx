import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  RotateCcw, 
  Bookmark, 
  School,
  Award,
  BookOpen,
  Maximize2
} from 'lucide-react';

export default function ExamPortal({ setActivePage, selectedExam, setSelectedExam }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Screen state: 'setup' | 'exam' | 'submitted'
  const [screen, setScreen] = useState(selectedExam ? 'exam' : 'setup');

  // Exam Configuration
  const [examSubject, setExamSubject] = useState(selectedExam?.subject || 'Mathematics');
  const [examClass, setExamClass] = useState(selectedExam?.cls || user?.class || 'Class 10');
  const [examType, setExamType] = useState(selectedExam?.examType || 'PT-1');
  const [examSession, setExamSession] = useState(selectedExam?.session || '2025-2026');

  // Exam Data
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIdx]: value }
  const [reviewed, setReviewed] = useState({}); // { [qIdx]: boolean }
  const [timeLeft, setTimeLeft] = useState(30 * 60); // seconds
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [warningCount, setWarningCount] = useState(0);

  const timerRef = useRef(null);

  // Available subjects for setup screen
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await api.getQuestions({ class: examClass });
        if (res.success && res.questions) {
          const subjects = [...new Set(res.questions.map((q) => q.subject))];
          setAvailableSubjects(subjects);
          if (subjects.length > 0 && !selectedExam) {
            setExamSubject(subjects[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load subjects', err);
      }
    }
    if (screen === 'setup') {
      loadSubjects();
    }
  }, [examClass, screen, selectedExam]);

  // Start exam when selectedExam is provided or setup confirmed
  useEffect(() => {
    if (screen === 'exam') {
      startExamSession();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  // Anti-cheating blur listener during exam
  useEffect(() => {
    if (screen !== 'exam') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => {
          const next = prev + 1;
          showToast(`⚠️ Proctor Warning #${next}: Switching tabs during the test is monitored!`, 'warning', 4500);
          return next;
        });
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [screen, showToast]);

  const startExamSession = async () => {
    try {
      showToast('Loading examination paper...', 'info', 1500);
      const res = await api.getQuestions({
        class: examClass,
        subject: examSubject,
      });

      let loadedQuestions = [];
      let durationMinutes = 30;

      if (res.success && res.questions) {
        if (Array.isArray(res.questions)) {
          // If returned as an array of question papers or items
          if (res.questions[0] && res.questions[0].questions) {
            loadedQuestions = res.questions[0].questions;
            durationMinutes = res.questions[0].timeLimit || 30;
          } else {
            loadedQuestions = res.questions;
          }
        }
      }

      if (loadedQuestions.length === 0) {
        showToast('No active question paper found for this subject and class', 'error');
        setScreen('setup');
        return;
      }

      setQuestions(loadedQuestions);
      setTimeLeft(durationMinutes * 60);
      setAnswers({});
      setReviewed({});
      setCurrentIdx(0);

      // Start countdown
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            autoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Try entering fullscreen
      try {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {}

      showToast(`Exam started! Total ${loadedQuestions.length} Questions | ${durationMinutes} Mins`, 'success');
    } catch (err) {
      showToast('Failed to start exam paper', 'error');
      setScreen('setup');
    }
  };

  const handleSelectAnswer = (qIndex, val) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: val,
    }));
  };

  const handleClearAnswer = (qIndex) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qIndex];
      return copy;
    });
  };

  const toggleReview = (qIndex) => {
    setReviewed((prev) => ({
      ...prev,
      [qIndex]: !prev[qIndex],
    }));
  };

  const autoSubmit = () => {
    showToast('⏰ Time expired! Auto-submitting your examination paper...', 'warning', 3000);
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Format answers array
    const answersPayload = questions.map((q, idx) => {
      const userAns = answers[idx];
      return {
        qId: q.id || idx,
        qText: q.text || q.questionText,
        type: q.type || 'mcq',
        options: q.options || [],
        userAnswer: userAns !== undefined ? userAns : '',
        correctAnswer: q.correctAnswer || (q.options ? q.options[q.correctOption] : ''),
        marks: q.marks || 1,
      };
    });

    const payload = {
      studentName: user?.name || 'Student Candidate',
      rollNumber: user?.rollNumber || '00',
      classNumber: examClass,
      section: user?.section || 'A',
      subject: examSubject,
      examType: examType,
      session: examSession,
      year: examSession,
      answers: answersPayload,
      timeSpent: 30 * 60 - timeLeft,
      totalMarks: questions.reduce((sum, q) => sum + (q.marks || 1), 0),
    };

    try {
      const res = await api.submitExamResult(payload);
      if (res.success) {
        setFinalResult(res.result || res);
        setScreen('submitted');
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#06b6d4', '#10b981', '#fbbf24', '#c084fc'],
        });

        showToast('Exam submitted successfully! Result recorded.', 'success');
      } else {
        showToast(res.message || 'Submission failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error submitting test', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Timer format
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIdx] || {};
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const reviewCount = Object.values(reviewed).filter(Boolean).length;
  const isUrgent = timeLeft <= 60;

  // ── Setup Screen ──
  if (screen === 'setup') {
    return (
      <div className="app-container" style={{ maxWidth: '650px', padding: '40px 20px' }}>
        <div className="glass-card" style={{ padding: '36px 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="school-badge" style={{ marginBottom: '12px' }}>
              <School size={15} /> CBT Online Exam
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
              Select Examination Paper
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Select your subject and periodic test type to commence
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Student Class</label>
            <input
              type="text"
              className="form-control"
              value={examClass}
              readOnly
              style={{ background: 'var(--surface2)', opacity: 0.9, fontWeight: 700 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Periodic Test / Assessment Type</label>
            <select
              className="form-control"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option value="PT-1">Periodic Test 1 (PT-1)</option>
              <option value="PT-2">Periodic Test 2 (PT-2)</option>
              <option value="PT-3">Periodic Test 3 (PT-3)</option>
              <option value="PT-4">Periodic Test 4 (PT-4)</option>
              <option value="Class Test">Class Test (Instant AI Graded)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Subject</label>
            {availableSubjects.length > 0 ? (
              <select
                className="form-control"
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
              >
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Science, Mathematics, English"
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
                required
              />
            )}
          </div>

          <div
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              fontSize: '0.86rem',
              color: 'var(--text-muted)',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}
          >
            📌 <strong>Important Instructions:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
              <li>Do not refresh the browser or switch tabs during the test.</li>
              <li>Questions can be marked for review and answered later.</li>
              <li>The exam will auto-submit when the countdown expires.</li>
            </ul>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            onClick={() => setScreen('exam')}
          >
            Commence Test Session <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── Submitted / Result Screen ──
  if (screen === 'submitted' && finalResult) {
    const pct = finalResult.total > 0 ? Math.round((finalResult.score / finalResult.total) * 100) : 0;
    const isPassed = pct >= 40;

    return (
      <div className="app-container" style={{ maxWidth: '650px', padding: '40px 20px' }}>
        <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isPassed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `2px solid ${isPassed ? 'var(--success)' : 'var(--danger)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: isPassed ? '0 0 30px rgba(34, 197, 94, 0.4)' : 'none',
            }}
          >
            {isPassed ? <Award size={40} color="var(--success)" /> : <RotateCcw size={40} color="var(--danger)" />}
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
            {isPassed ? '🎉 Examination Completed Successfully!' : '📝 Examination Finished'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
            Your responses for <strong>{examSubject} ({examType})</strong> have been securely recorded.
          </p>

          <div
            className="grid-3"
            style={{
              background: 'var(--surface2)',
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '28px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Score
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-light)', marginTop: '4px' }}>
                {finalResult.score} / {finalResult.total}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Percentage
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent)', marginTop: '4px' }}>
                {pct}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Result Status
              </div>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: isPassed ? 'var(--success)' : 'var(--danger)',
                  marginTop: '6px',
                }}
              >
                {isPassed ? 'PASSED ✅' : 'NEEDS REVISION'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (setSelectedExam) setSelectedExam(null);
                setActivePage('student');
              }}
            >
              Return to Student Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active Exam Screen ──
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Proctor & Timer Top Bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(10, 8, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="badge badge-accent" style={{ fontSize: '0.82rem' }}>
            {examType}
          </div>
          <div>
            <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{examSubject}</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>
              Class {examClass} • Candidate: {user?.name || 'Student'} ({user?.rollNumber || ''})
            </span>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
              border: `1px solid ${isUrgent ? 'var(--danger)' : 'rgba(99, 102, 241, 0.35)'}`,
              color: isUrgent ? '#f87171' : '#38bdf8',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '1.15rem',
              fontWeight: 800,
              boxShadow: isUrgent ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none',
              animation: isUrgent ? 'pulse 1s infinite' : 'none',
            }}
          >
            <Clock size={18} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            className="btn btn-success"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
            onClick={() => setShowConfirmModal(true)}
          >
            <Send size={15} /> Submit Test
          </button>
        </div>
      </div>

      {/* Main Examination Split Area */}
      <div
        className="app-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '24px',
          paddingTop: '24px',
          flex: 1,
        }}
      >
        {/* Left Column: Question Card & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="glass-card"
            style={{
              padding: '30px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Question Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      background: 'var(--primary)',
                      color: '#fff',
                      fontWeight: 900,
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.92rem',
                    }}
                  >
                    Question {currentIdx + 1}
                  </span>
                  <span
                    className={`badge ${
                      currentQ.type === 'owa'
                        ? 'badge-secondary'
                        : currentQ.type === 'tf'
                        ? 'badge-accent'
                        : 'badge-primary'
                    }`}
                  >
                    {currentQ.type === 'owa'
                      ? 'One Word Answer'
                      : currentQ.type === 'tf'
                      ? 'True / False'
                      : 'MCQ'}
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Marks: <strong>{currentQ.marks || 1}</strong>
                </span>
              </div>

              {/* Question Body Text */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  lineHeight: 1.6,
                  color: '#fff',
                  marginBottom: '28px',
                }}
              >
                {currentQ.text || currentQ.questionText || 'Question statement'}
              </h3>

              {/* Choices / Input Area */}
              {currentQ.type === 'tf' ? (
                /* True / False Options */
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['True', 'False'].map((val) => {
                    const isSelected = String(answers[currentIdx]).toLowerCase() === val.toLowerCase();
                    return (
                      <div
                        key={val}
                        onClick={() => handleSelectAnswer(currentIdx, val)}
                        style={{
                          flex: 1,
                          padding: '16px 20px',
                          borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${isSelected ? (val === 'True' ? 'var(--success)' : 'var(--danger)') : 'var(--border)'}`,
                          background: isSelected
                            ? val === 'True'
                              ? 'rgba(34, 197, 94, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)'
                            : 'var(--surface2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? (val === 'True' ? 'var(--success)' : 'var(--danger)') : 'var(--border)'}`,
                            background: isSelected ? (val === 'True' ? 'var(--success)' : 'var(--danger)') : 'transparent',
                          }}
                        />
                        <span>{val === 'True' ? '✅ True' : '❌ False'}</span>
                      </div>
                    );
                  })}
                </div>
              ) : currentQ.type === 'owa' ? (
                /* One Word Answer Input */
                <div>
                  <label className="form-label">Type your precise one-word answer:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter answer..."
                    value={answers[currentIdx] || ''}
                    onChange={(e) => handleSelectAnswer(currentIdx, e.target.value)}
                    style={{ fontSize: '1.1rem', padding: '14px 18px', maxWidth: '480px' }}
                  />
                </div>
              ) : (
                /* Standard MCQ Options */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(currentQ.options || []).map((opt, oi) => {
                    const isSelected = String(answers[currentIdx]) === String(oi) || answers[currentIdx] === opt;
                    const letter = String.fromCharCode(65 + oi);

                    return (
                      <div
                        key={oi}
                        onClick={() => handleSelectAnswer(currentIdx, oi)}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${isSelected ? 'var(--primary-light)' : 'var(--border)'}`,
                          background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'var(--surface2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                          }}
                        >
                          {letter}
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border)',
                paddingTop: '20px',
                marginTop: '32px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-surface"
                  onClick={() => handleClearAnswer(currentIdx)}
                  style={{ fontSize: '0.84rem' }}
                >
                  <RotateCcw size={14} /> Clear Response
                </button>
                <button
                  className={`btn ${reviewed[currentIdx] ? 'btn-secondary' : 'btn-surface'}`}
                  onClick={() => toggleReview(currentIdx)}
                  style={{ fontSize: '0.84rem' }}
                >
                  <Bookmark size={14} /> {reviewed[currentIdx] ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-surface"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <button
                  className="btn btn-primary"
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Question Palette Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '22px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
              Question Palette
            </h4>

            {/* Status Legend */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                fontSize: '0.76rem',
                marginBottom: '16px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--success)' }} />
                <span>Answered ({answeredCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--surface2)', border: '1px solid var(--border)' }} />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#c084fc' }} />
                <span>Review ({reviewCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid var(--accent)' }} />
                <span>Current</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                maxHeight: '340px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {questions.map((_, i) => {
                const isCurrent = i === currentIdx;
                const isAnswered = answers[i] !== undefined;
                const isMarked = !!reviewed[i];

                let bg = 'var(--surface2)';
                let color = 'var(--text-muted)';
                let border = '1px solid var(--border)';

                if (isAnswered) {
                  bg = 'rgba(34, 197, 94, 0.25)';
                  border = '1px solid var(--success)';
                  color = '#4ade80';
                }
                if (isMarked) {
                  bg = 'rgba(168, 85, 247, 0.25)';
                  border = '1px solid #c084fc';
                  color = '#c084fc';
                }
                if (isCurrent) {
                  border = '2px solid var(--accent)';
                  color = '#fff';
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    style={{
                      height: '38px',
                      borderRadius: '6px',
                      background: bg,
                      border: border,
                      color: color,
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => setShowConfirmModal(true)}
              >
                Finish &amp; Submit Paper
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>
              Confirm Examination Submission
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
              Are you sure you want to end your examination session and finalize your submission?
            </p>

            <div
              className="grid-3"
              style={{
                background: 'var(--surface2)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answered</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>{answeredCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unanswered</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--danger)' }}>{unansweredCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Review</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>{reviewCount}</div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  color: '#fbbf24',
                  fontSize: '0.84rem',
                  marginBottom: '20px',
                }}
              >
                ⚠️ You have <strong>{unansweredCount} unanswered questions</strong> remaining.
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
              >
                Back to Test
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmitExam}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Yes, Submit Final Paper'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
