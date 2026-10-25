import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import AnswersheetModal from '../components/AnswersheetModal';
import { 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  Trash2, 
  Download, 
  Upload, 
  Mail, 
  Activity, 
  Search, 
  Award,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard({ setActivePage }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('results'); // 'results' | 'students' | 'tools'

  // Results State
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultSearch, setResultSearch] = useState('');
  const [selectedAnswersheet, setSelectedAnswersheet] = useState(null);

  // Students State
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  // Email form state
  const [emailTo, setEmailTo] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // File upload for excel
  const [excelFile, setExcelFile] = useState(null);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  useEffect(() => {
    loadResults();
    loadStudents();
  }, []);

  const loadResults = async () => {
    setLoadingResults(true);
    try {
      const res = await api.getResults();
      if (res.success && res.results) {
        setResults(res.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResults(false);
    }
  };

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await api.getAllStudents();
      if (res.success && res.students) {
        setStudents(res.students);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result permanently?')) return;
    try {
      const res = await api.deleteResult(id);
      if (res.success) {
        showToast('Result deleted successfully', 'success');
        setResults((prev) => prev.filter((r) => r.id !== id));
      } else {
        showToast(res.message || 'Failed to delete', 'error');
      }
    } catch (err) {
      showToast('Error deleting result', 'error');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this registered student account?')) return;
    try {
      const res = await api.deleteStudent(id);
      if (res.success) {
        showToast('Student account removed', 'success');
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } else {
        showToast(res.message || 'Failed to delete student', 'error');
      }
    } catch (err) {
      showToast('Error deleting student', 'error');
    }
  };

  const handleImportExcel = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      showToast('Please choose an Excel file (.xlsx)', 'warning');
      return;
    }
    const formData = new FormData();
    formData.append('file', excelFile);

    setUploadingExcel(true);
    try {
      const res = await api.importExcel(formData);
      if (res.success) {
        showToast('Excel results imported successfully!', 'success');
        loadResults();
        setExcelFile(null);
      } else {
        showToast(res.message || 'Excel import failed', 'error');
      }
    } catch (err) {
      showToast('Error parsing Excel', 'error');
    } finally {
      setUploadingExcel(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailTo) {
      showToast('Please enter recipient email', 'warning');
      return;
    }
    setSendingEmail(true);
    try {
      const res = await api.sendEmail({ email: emailTo });
      if (res.success) {
        showToast(`Results report dispatched to ${emailTo}!`, 'success');
        setEmailTo('');
      } else {
        showToast(res.message || 'Email dispatch failed', 'error');
      }
    } catch (err) {
      showToast('Could not send email', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  // Filtered Results
  const filteredResults = results.filter((r) => {
    if (!resultSearch) return true;
    const q = resultSearch.toLowerCase();
    return (
      (r.studentName || r.name || '').toLowerCase().includes(q) ||
      (r.rollNumber || '').toLowerCase().includes(q) ||
      (r.subject || '').toLowerCase().includes(q) ||
      (r.class || '').toLowerCase().includes(q)
    );
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    if (!studentSearch) return true;
    const q = studentSearch.toLowerCase();
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.rollNumber || '').toLowerCase().includes(q) ||
      (s.class || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-container" style={{ paddingBottom: '60px' }}>
      {/* ── Admin Cockpit Header ── */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          marginBottom: '26px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25), rgba(245, 158, 11, 0.15))',
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
              background: 'linear-gradient(135deg, #4f46e5, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
            }}
          >
            🛡️
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
              Principal &amp; Administrator Cockpit
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Full institutional oversight, Excel synchronization, and credential control
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-surface" onClick={() => { loadResults(); loadStudents(); }}>
            <RefreshCw size={15} /> Refresh Data
          </button>
        </div>
      </div>

      {/* ── Master KPI Row ── */}
      <div className="grid-3" style={{ marginBottom: '26px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent)' }}>
            {students.length}
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Registered Students
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-light)' }}>
            {results.length}
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Exam Submissions Recorded
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--success)' }}>
            Online &amp; Active
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            CBT Server Health
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
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
          className={`btn ${activeTab === 'results' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('results')}
          style={{ flex: 1, padding: '10px' }}
        >
          <Award size={16} /> All Exam Submissions ({results.length})
        </button>
        <button
          className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('students')}
          style={{ flex: 1, padding: '10px' }}
        >
          <Users size={16} /> Student Directory ({students.length})
        </button>
        <button
          className={`btn ${activeTab === 'tools' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('tools')}
          style={{ flex: 1, padding: '10px' }}
        >
          <FileSpreadsheet size={16} /> Excel Sync &amp; Dispatch
        </button>
      </div>

      {/* ── TAB 1: ALL RESULTS ── */}
      {activeTab === 'results' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Institutional Exam Records
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search student, roll, or subject..."
                value={resultSearch}
                onChange={(e) => setResultSearch(e.target.value)}
                style={{ width: '280px' }}
              />
              <a
                href={api.exportExcelUrl}
                download
                className="btn btn-accent"
                style={{ textDecoration: 'none' }}
              >
                <Download size={15} /> Export Excel
              </a>
            </div>
          </div>

          {loadingResults ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading examination results database...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No examination records found.
            </div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Roll</th>
                    <th>Candidate</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Test Type</th>
                    <th>Score / Total</th>
                    <th>%</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r, i) => {
                    const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                    return (
                      <tr key={r.id || i}>
                        <td><strong>{r.rollNumber || '-'}</strong></td>
                        <td><strong style={{ color: '#fff' }}>{r.studentName || r.name}</strong></td>
                        <td>{r.class}</td>
                        <td>{r.subject}</td>
                        <td><span className="badge badge-primary">{r.examType || 'PT-1'}</span></td>
                        <td>
                          <strong style={{ color: 'var(--primary-light)' }}>
                            {r.score} / {r.total}
                          </strong>
                        </td>
                        <td><strong>{pct}%</strong></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn btn-surface"
                              style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                              onClick={() => setSelectedAnswersheet(r)}
                            >
                              Answers
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                              onClick={() => handleDeleteResult(r.id)}
                            >
                              <Trash2 size={13} />
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
      )}

      {/* ── TAB 2: STUDENT DIRECTORY ── */}
      {activeTab === 'students' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Student Candidate Roster
            </h3>
            <input
              type="text"
              className="form-control"
              placeholder="Search by student name or roll..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{ width: '280px' }}
            />
          </div>

          {loadingStudents ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading student roster...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No students found.
            </div>
          ) : (
            <div className="custom-table-wrap">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Candidate Name</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Contact Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td><strong>{s.rollNumber}</strong></td>
                      <td><strong style={{ color: '#fff' }}>{s.name}</strong></td>
                      <td>{s.class}</td>
                      <td>Section {s.section || 'A'}</td>
                      <td>{s.phone || '-'}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                          onClick={() => handleDeleteStudent(s.id)}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: EXCEL TOOLS & EMAIL ── */}
      {activeTab === 'tools' && (
        <div className="grid-2">
          {/* Excel Bulk Import */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <FileSpreadsheet size={24} color="var(--success)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Excel Results Synchronization
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
              Upload an offline score sheet to automatically sync and generate digital certificates.
            </p>

            <form onSubmit={handleImportExcel}>
              <div className="form-group">
                <label className="form-label">Select .xlsx File</label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="form-control"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={api.exportTemplateUrl}
                  download
                  className="btn btn-surface"
                  style={{ textDecoration: 'none' }}
                >
                  <Download size={14} /> Download Format Template
                </a>
                <button type="submit" className="btn btn-success" disabled={uploadingExcel}>
                  <Upload size={14} /> {uploadingExcel ? 'Importing...' : 'Upload Excel'}
                </button>
              </div>
            </form>
          </div>

          {/* Email Results Dispatch */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Mail size={24} color="var(--accent)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Email Results Notification
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
              Send full school evaluation reports directly to principal / management email.
            </p>

            <form onSubmit={handleSendEmail}>
              <div className="form-group">
                <label className="form-label">Recipient Official Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="principal@oxfordconvent.com"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent" disabled={sendingEmail}>
                <Mail size={15} /> {sendingEmail ? 'Sending Report...' : 'Dispatch Report Email'}
              </button>
            </form>
          </div>
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
