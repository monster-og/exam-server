import React from 'react';
import { X, CheckCircle, XCircle, Award, HelpCircle } from 'lucide-react';

export default function AnswersheetModal({ result, onClose }) {
  if (!result) return null;

  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
  const isPassed = pct >= 40;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '14px',
            marginBottom: '18px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              🔑 Official Exam Answer Sheet & Solution
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              {result.subject} • Class {result.class} ({result.examType || 'Exam'}) • Session {result.session || result.year || '2025-2026'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Score Overview Bar */}
        <div
          className="grid-4"
          style={{
            background: 'var(--surface2)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Student
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '3px' }}>
              {result.name || result.studentName || 'Student'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Score Secured
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-light)', marginTop: '2px' }}>
              {result.score} / {result.total}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Percentage
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)', marginTop: '2px' }}>
              {pct}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Status
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: '1rem',
                color: isPassed ? 'var(--success)' : 'var(--danger)',
                marginTop: '3px',
              }}
            >
              {isPassed ? 'PASSED ✅' : 'NEEDS REVISION ❌'}
            </div>
          </div>
        </div>

        {/* Detailed Questions List */}
        <div style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '6px' }}>
          {result.answers && result.answers.length > 0 ? (
            result.answers.map((a, i) => {
              const isOWA = a.type === 'owa';
              const isTF = a.type === 'tf';
              
              let isCorrect = !!a.isCorrect;
              if (isTF) {
                isCorrect = String(a.userAnswer).toLowerCase() === String(a.correctAnswer).toLowerCase();
              } else if (!isOWA) {
                isCorrect = String(a.userAnswer) === String(a.correctAnswer);
              }

              const studentAnsText = isTF
                ? (a.userAnswer || 'Not Answered')
                : isOWA
                ? (a.userAnswer || 'Not Answered')
                : (a.options?.[a.userAnswer] || (a.userAnswer !== undefined ? `Option ${Number(a.userAnswer) + 1}` : 'Not Answered'));

              const correctAnsText = isTF
                ? a.correctAnswer
                : isOWA
                ? (a.correctAnswer || a.expectedAnswer || 'Teacher Evaluated')
                : (a.options?.[a.correctAnswer] || a.correctAnswer);

              const marksAwarded = a.owaMarksAwarded !== undefined 
                ? a.owaMarksAwarded 
                : (isCorrect ? (a.marks || 1) : 0);
              const maxMarks = a.marks || (isOWA ? 2 : 1);

              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--surface2)',
                    borderLeft: `4px solid ${isCorrect ? 'var(--success)' : isOWA ? '#c084fc' : 'var(--danger)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>
                      Question {i + 1}: {a.qText || a.text}
                    </span>
                    <span
                      className={`badge ${
                        isOWA ? 'badge-secondary' : isTF ? 'badge-accent' : 'badge-primary'
                      }`}
                    >
                      {isOWA ? 'One Word Answer' : isTF ? 'True / False' : 'MCQ'}
                    </span>
                  </div>

                  {/* Answers Comparison */}
                  <div style={{ fontSize: '0.9rem', margin: '10px 0', lineHeight: 1.6 }}>
                    <div>
                      Your Answer:{' '}
                      <strong
                        style={{
                          color: isCorrect ? 'var(--success)' : 'var(--danger)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {studentAnsText}
                      </strong>{' '}
                      {isCorrect ? '✅' : '❌'}
                    </div>

                    {!isCorrect && (
                      <div
                        style={{
                          marginTop: '6px',
                          background: 'rgba(34, 197, 94, 0.12)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                        }}
                      >
                        💡 <span style={{ color: 'var(--success)', fontWeight: 700 }}>Correct / Expected Solution:</span>{' '}
                        <strong style={{ color: '#4ade80' }}>{correctAnsText}</strong>
                      </div>
                    )}

                    {a.aiReason && (
                      <div
                        style={{
                          marginTop: '6px',
                          fontSize: '0.84rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#cbd5e1',
                        }}
                      >
                        🤖 <strong>AI Grading Analysis:</strong> {a.aiReason}
                      </div>
                    )}
                  </div>

                  {/* Marks info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '8px',
                      fontSize: '0.84rem',
                    }}
                  >
                    <span style={{ color: isCorrect ? 'var(--success)' : 'var(--text-muted)' }}>
                      {isCorrect ? 'Awarded Full Credit' : 'Evaluated'}
                    </span>
                    <span style={{ fontWeight: 800, color: isCorrect ? 'var(--success)' : 'var(--text-muted)' }}>
                      Marks: {marksAwarded} / {maxMarks}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
              No detailed question records found for this submission.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close Solution Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
