import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import A4MarksheetModal from '../components/A4MarksheetModal';
import { 
  Award, 
  Search, 
  Printer, 
  CheckCircle2, 
  School, 
  BookOpen,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

export default function CheckResultPage({ setActivePage }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [searchName, setSearchName] = useState(user?.name || '');
  const [searchRoll, setSearchRoll] = useState(user?.rollNumber || '');
  const [searchClass, setSearchClass] = useState(user?.class || 'Class 10');
  const [searchPt, setSearchPt] = useState('all');
  const [searchYear, setSearchYear] = useState('2025-2026');

  const [loading, setLoading] = useState(false);
  const [matchedResults, setMatchedResults] = useState(null);
  const [selectedMarksheet, setSelectedMarksheet] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim() && !searchRoll.trim()) {
      showToast('Please enter either student name or roll number', 'warning');
      return;
    }

    setLoading(true);
    setMatchedResults(null);
    try {
      const params = {
        name: searchName.trim(),
        rollNumber: searchRoll.trim(),
        class: searchClass,
        examType: searchPt !== 'all' ? searchPt : undefined,
        session: searchYear !== 'all' ? searchYear : undefined,
      };

      const res = await api.checkPublicResult(params);
      if (res.success && res.results && res.results.length > 0) {
        setMatchedResults(res.results);
        showToast(`Found ${res.results.length} verified result records!`, 'success');
      } else {
        setMatchedResults([]);
        showToast('No published records matched the search criteria', 'info');
      }
    } catch (err) {
      showToast('Error searching verified results', 'error');
      setMatchedResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMarksheet = async (r) => {
    try {
      showToast('Generating official report card...', 'info', 1500);
      const res = await api.getCumulativeMarksheet({
        name: r.studentName || r.name,
        cls: r.class,
        session: r.session || r.year || '2025-2026',
        examType: r.examType || 'PT-1',
      });

      if (res && res.success && res.marksheet) {
        setSelectedMarksheet(res);
      } else {
        setSelectedMarksheet({
          marksheet: {
            student: { name: r.studentName || r.name, rollNumber: r.rollNumber, class: r.class },
            totals: {
              maxMarks: r.total,
              securedMarks: r.score,
              percentage: r.total ? Math.round((r.score / r.total) * 100) : 0,
              grade: (r.score / r.total) >= 0.8 ? 'A1' : 'B1',
              status: (r.score / r.total) >= 0.4 ? 'PASSED' : 'NEEDS REVISION',
            },
            subjects: [{
              subject: r.subject,
              maxMarks: r.total,
              passingMarks: Math.round(r.total * 0.4),
              securedMarks: r.score,
              grade: 'A',
            }],
            session: r.session || '2025-2026',
            examType: r.examType || 'Class Test',
          }
        });
      }
    } catch (err) {
      showToast('Error loading certificate', 'error');
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '850px', padding: '36px 20px 80px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="school-badge">
          <Award size={15} /> Verified Institutional Registry
        </div>
        <h1 className="grand-title" style={{ marginTop: '10px' }}>
          Official Result &amp; Scorecard Verification
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
          Check and download authenticated Periodic Test (PT) marksheets and Class Test assessment evaluations
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="glass-card" style={{ padding: '30px 28px', marginBottom: '30px' }}>
        <form onSubmit={handleSearch}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Student Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter candidate full name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 101"
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                className="form-control"
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Periodic Test Type</label>
              <select
                className="form-control"
                value={searchPt}
                onChange={(e) => setSearchPt(e.target.value)}
              >
                <option value="all">🌐 All Tests (PT &amp; Class Tests)</option>
                <option value="PT-1">Periodic Test 1 (PT-1)</option>
                <option value="PT-2">Periodic Test 2 (PT-2)</option>
                <option value="PT-3">Periodic Test 3 (PT-3)</option>
                <option value="PT-4">Periodic Test 4 (PT-4)</option>
                <option value="Class Test">Class Test</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Session</label>
              <select
                className="form-control"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
              >
                <option value="all">All Sessions</option>
                <option value="2026-2027">2026-2027</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px' }}
            disabled={loading}
          >
            <Search size={16} /> {loading ? 'Querying Institutional Database...' : 'Search & Verify Scorecard'}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {matchedResults && (
        <div>
          {matchedResults.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h4>No Verified Record Found</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
                Please ensure the Student Name and Roll Number match the school records exactly.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {matchedResults.map((r, i) => {
                const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                const isPassed = pct >= 40;

                return (
                  <div key={r.id || i} className="glass-card" style={{ padding: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                            {r.studentName || r.name}
                          </h3>
                          <span className="badge badge-accent">Roll No: {r.rollNumber || '-'}</span>
                        </div>
                        <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Class {r.class} • Session {r.session || r.year || '2025-2026'} • Test: <strong>{r.examType || 'PT-1'}</strong>
                        </div>
                      </div>

                      <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.82rem' }}>
                        {isPassed ? 'Verified Passed' : 'Evaluated'}
                      </span>
                    </div>

                    <div
                      className="grid-3"
                      style={{
                        background: 'var(--surface2)',
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '18px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{r.subject}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Marks Secured</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-light)', marginTop: '2px' }}>
                          {r.score} / {r.total}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Percentage</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent)', marginTop: '2px' }}>
                          {pct}%
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        className="btn btn-accent"
                        onClick={() => handleOpenMarksheet(r)}
                        style={{ padding: '8px 16px' }}
                      >
                        <Printer size={15} /> Official Marksheet Card
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* A4 Marksheet Modal */}
      {selectedMarksheet && (
        <A4MarksheetModal
          marksheetData={selectedMarksheet}
          onClose={() => setSelectedMarksheet(null)}
        />
      )}
    </div>
  );
}
