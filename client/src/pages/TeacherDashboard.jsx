import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import AnswersheetModal from '../components/AnswersheetModal';
import { 
  UserCheck, 
  PlusCircle, 
  Trash2, 
  Save, 
  BookOpen, 
  Award, 
  Users, 
  HelpCircle, 
  Check, 
  FileText,
  Search
} from 'lucide-react';

const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

export default function TeacherDashboard({ setActivePage }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'submissions' | 'roster'

  // Question Creator State
  const [targetClass, setTargetClass] = useState('Class 10');
  const [targetSubject, setTargetSubject] = useState('Mathematics');
  const [examType, setExamType] = useState('PT-1');
  const [timeLimit, setTimeLimit] = useState(30);
  const [session, setSession] = useState('2025-2026');

  const [qList, setQList] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // New Question Form
  const [newType, setNewType] = useState('mcq'); // 'mcq' | 'tf' | 'owa'
  const [newText, setNewText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [tfCorrect, setTfCorrect] = useState('True');
  const [owaExpected, setOwaExpected] = useState('');
  const [newMarks, setNewMarks] = useState(1);

  // Submissions State
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [selectedAnswersheet, setSelectedAnswersheet] = useState(null);
  const [subSearch, setSubSearch] = useState('');

  // Roster State
  const [roster, setRoster] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Load existing questions when Class or Subject changes
  useEffect(() => {
    async function loadQuestions() {
      setLoadingQuestions(true);
      try {
        const res = await api.getQuestions({ class: targetClass, subject: targetSubject });
        if (res.success && res.questions) {
          if (Array.isArray(res.questions) && res.questions[0] && res.questions[0].questions) {
            setQList(res.questions[0].questions);
            setTimeLimit(res.questions[0].timeLimit || 30);
          } else if (Array.isArray(res.questions)) {
            setQList(res.questions);
          } else {
            setQList([]);
          }
        } else {
          setQList([]);
        }
      } catch (err) {
        console.error('Failed to load questions', err);
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadQuestions();
  }, [targetClass, targetSubject]);

  // Load submissions
  useEffect(() => {
    if (activeTab === 'submissions') {
      loadSubmissions();
    } else if (activeTab === 'roster') {
      loadRoster();
    }
  }, [activeTab, targetClass]);

  const loadSubmissions = async () => {
    setLoadingSubs(true);
    try {
      const res = await api.getResults({ class: targetClass });
      if (res.success && res.results) {
        setSubmissions(res.results);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubs(false);
    }
  };

  const loadRoster = async () => {
    setLoadingRoster(true);
    try {
      const res = await api.getAllStudents();
      if (res.success && res.students) {
        setRoster(res.students.filter((s) => s.class === targetClass));
      } else {
        setRoster([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoster(false);
    }
  };

  // Add question to temporary buffer
  const handleAddQuestion = () => {
    if (!newText.trim()) {
      showToast('Please enter the question text', 'warning');
      return;
    }

    let qObj = {
      text: newText.trim(),
      type: newType,
      marks: Number(newMarks) || 1,
    };

    if (newType === 'mcq') {
      const filtered = newOptions.map((o) => o.trim());
      if (filtered.some((o) => !o)) {
        showToast('Please fill all 4 options for MCQ', 'warning');
        return;
      }
      qObj.options = filtered;
      qObj.correctOption = Number(correctOption);
      qObj.correctAnswer = filtered[correctOption];
    } else if (newType === 'tf') {
      qObj.options = ['True', 'False'];
      qObj.correctAnswer = tfCorrect;
    } else if (newType === 'owa') {
      if (!owaExpected.trim()) {
        showToast('Please specify the expected one-word answer', 'warning');
        return;
      }
      qObj.correctAnswer = owaExpected.trim();
      qObj.expectedAnswer = owaExpected.trim();
    }

    setQList((prev) => [...prev, qObj]);
    setNewText('');
    setNewOptions(['', '', '', '']);
    setOwaExpected('');
    showToast('Question added to current paper!', 'success');
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    setQList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save paper to server
  const handleSavePaper = async () => {
    if (qList.length === 0) {
      showToast('Please add at least one question before saving', 'warning');
      return;
    }

    try {
      showToast('Saving question paper to server...', 'info', 2000);
      const res = await api.saveQuestions({
        classNumber: targetClass,
        subject: targetSubject,
        examType: examType,
        session: session,
        timeLimit: Number(timeLimit) || 30,
        questions: qList,
      });

      if (res.success) {
        showToast(`Question paper for ${targetSubject} (${targetClass}) saved successfully!`, 'success');
      } else {
        showToast(res.message || 'Failed to save paper', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving paper', 'error');
    }
  };

  // Filtered Submissions
  const filteredSubs = submissions.filter((s) => {
    if (!subSearch) return true;
    const q = subSearch.toLowerCase();
    return (
      (s.studentName || s.name || '').toLowerCase().includes(q) ||
      (s.rollNumber || '').toLowerCase().includes(q) ||
      (s.subject || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-container" style={{ paddingBottom: '60px' }}>
      {/* ── Faculty Banner ── */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          marginBottom: '26px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(79, 70, 229, 0.15))',
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
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #06b6d4, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
            }}
          >
            👨‍🏫
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
              Faculty Assessment Dashboard
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Oxford Convent School • Online CBT Paper Authoring &amp; Class Grading Console
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="form-control"
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            style={{ width: '160px', fontWeight: 700, borderColor: 'var(--accent)' }}
          >
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '6px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          marginBottom: '26px',
        }}
      >
        <button
          className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('questions')}
          style={{ flex: 1, padding: '10px' }}
        >
          <BookOpen size={16} /> Question Bank &amp; Exam Builder
        </button>
        <button
          className={`btn ${activeTab === 'submissions' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('submissions')}
          style={{ flex: 1, padding: '10px' }}
        >
          <Award size={16} /> Student Submissions &amp; Grading
        </button>
        <button
          className={`btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('roster')}
          style={{ flex: 1, padding: '10px' }}
        >
          <Users size={16} /> Enrolled Class Roster
        </button>
      </div>

      {/* ── TAB 1: QUESTION BANK BUILDER ── */}
      {activeTab === 'questions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
          {/* Left: Question Authoring Form */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#fff' }}>
              Create / Add New Question
            </h3>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mathematics"
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Exam Type</label>
                <select
                  className="form-control"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                >
                  <option value="PT-1">Periodic Test 1 (PT-1)</option>
                  <option value="PT-2">Periodic Test 2 (PT-2)</option>
                  <option value="PT-3">Periodic Test 3 (PT-3)</option>
                  <option value="PT-4">Periodic Test 4 (PT-4)</option>
                  <option value="Class Test">Class Test</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select
                  className="form-control"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="tf">True / False</option>
                  <option value="owa">One Word Answer (OWA)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Marks</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  value={newMarks}
                  onChange={(e) => setNewMarks(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Question Statement</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Type the full question statement..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
            </div>

            {/* MCQ Options Inputs */}
            {newType === 'mcq' && (
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Options (Select the correct option radio)</label>
                {newOptions.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={correctOption === oi}
                      onChange={() => setCorrectOption(oi)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--success)' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newOptions];
                        copy[oi] = e.target.value;
                        setNewOptions(copy);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* True/False Input */}
            {newType === 'tf' && (
              <div className="form-group">
                <label className="form-label">Correct Solution</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['True', 'False'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      className={`btn ${tfCorrect === tf ? 'btn-success' : 'btn-surface'}`}
                      style={{ flex: 1 }}
                      onClick={() => setTfCorrect(tf)}
                    >
                      {tf === 'True' ? '✅ True' : '❌ False'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* One Word Answer */}
            {newType === 'owa' && (
              <div className="form-group">
                <label className="form-label">Expected One Word / Keyword Answer</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Photosynthesis"
                  value={owaExpected}
                  onChange={(e) => setOwaExpected(e.target.value)}
                />
              </div>
            )}

            <button
              type="button"
              className="btn btn-accent"
              style={{ width: '100%', padding: '12px' }}
              onClick={handleAddQuestion}
            >
              <PlusCircle size={16} /> Add Question to Paper
            </button>
          </div>

          {/* Right: Current Paper Queue & Save */}
          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  Paper Queue ({qList.length} Questions)
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {targetSubject} • {targetClass}
                </span>
              </div>
              <button className="btn btn-success" onClick={handleSavePaper}>
                <Save size={16} /> Save Paper
              </button>
            </div>

            <div style={{ flex: 1, maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
              {qList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                  <HelpCircle size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <p>No questions yet. Add questions on the left.</p>
                </div>
              ) : (
                qList.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--surface2)',
                      padding: '14px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '10px',
                      borderLeft: '4px solid var(--primary-light)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '0.92rem' }}>Q{idx + 1}: {q.text}</strong>
                      <button
                        onClick={() => handleRemoveQuestion(idx)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-light)', marginTop: '4px' }}>
                      Type: {q.type.toUpperCase()} | Correct: {q.correctAnswer} | Marks: {q.marks || 1}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: SUBMISSIONS & GRADING ── */}
      {activeTab === 'submissions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Student Submissions for {targetClass}
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by student name or roll..."
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                style={{ width: '280px' }}
              />
            </div>
          </div>

          {loadingSubs ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading student submissions...
            </div>
          ) : filteredSubs.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No submissions found for {targetClass}.
            </div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Candidate Name</th>
                    <th>Subject</th>
                    <th>Test Type</th>
                    <th>Submitted Date</th>
                    <th>Score / Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map((sub, i) => {
                    const pct = sub.total > 0 ? Math.round((sub.score / sub.total) * 100) : 0;
                    const isPassed = pct >= 40;
                    return (
                      <tr key={sub.id || i}>
                        <td><strong>{sub.rollNumber || '-'}</strong></td>
                        <td><strong style={{ color: '#fff' }}>{sub.studentName || sub.name}</strong></td>
                        <td>{sub.subject}</td>
                        <td><span className="badge badge-primary">{sub.examType || 'PT-1'}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary-light)' }}>
                            {sub.score} / {sub.total} ({pct}%)
                          </strong>
                        </td>
                        <td>
                          <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
                            {isPassed ? 'Passed' : 'Needs Work'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-accent"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => setSelectedAnswersheet(sub)}
                          >
                            Review Answers
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: CLASS ROSTER ── */}
      {activeTab === 'roster' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '18px' }}>
            Enrolled Students in {targetClass} ({roster.length} Registered)
          </h3>

          {loadingRoster ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading class roster...
            </div>
          ) : roster.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No registered students in {targetClass} yet.
            </div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Mobile Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td><strong>{idx + 1}</strong></td>
                      <td><strong>{s.rollNumber}</strong></td>
                      <td><strong style={{ color: '#fff' }}>{s.name}</strong></td>
                      <td>{s.class}</td>
                      <td>Section {s.section || 'A'}</td>
                      <td>{s.phone || '-'}</td>
                      <td><span className="badge badge-success">Enrolled</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Answersheet Modal */}
      {selectedAnswersheet && (
        <AnswersheetModal
          result={selectedAnswersheet}
          onClose={() => setSelectedAnswersheet(null)}
        />
      )}
    </div>
  );
}
