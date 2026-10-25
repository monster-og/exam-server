import React, { useRef } from 'react';
import { X, Printer, Download, Award, CheckCircle } from 'lucide-react';

export default function A4MarksheetModal({ marksheetData, onClose }) {
  const printRef = useRef(null);

  if (!marksheetData) return null;

  const m = marksheetData.marksheet || marksheetData;
  const std = m.student || {};
  const totals = m.totals || {
    maxMarks: m.total || 0,
    securedMarks: m.score || 0,
    percentage: m.total ? Math.round((m.score / m.total) * 100) : 0,
    grade: 'A',
    status: (m.score / m.total) >= 0.4 ? 'PASSED' : 'NEEDS REVISION',
  };

  const isPass = totals.status === 'PASSED';
  const subjects = m.subjects || [
    {
      subject: m.subject || 'Comprehensive Examination',
      maxMarks: totals.maxMarks,
      passingMarks: Math.round(totals.maxMarks * 0.4),
      securedMarks: totals.securedMarks,
      grade: totals.grade,
      status: totals.status,
    },
  ];

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Student Marksheet — Oxford Convent School, Sasaram</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Outfit', sans-serif; 
              background: #fff; 
              color: #0f172a; 
              padding: 20px; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
            @page { size: A4 portrait; margin: 10mm; }
            .sheet-border {
              border: 3px double #1e3a8a;
              border-radius: 8px;
              padding: 24px;
              position: relative;
            }
            .header-title { font-size: 24pt; font-weight: 900; color: #1e3a8a; text-align: center; }
            .header-sub { font-size: 10pt; color: #475569; text-align: center; margin-top: 4px; }
            .report-name { font-size: 13pt; font-weight: 800; color: #0f172a; text-align: center; margin-top: 10px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            .info-table { width: 100%; border-collapse: collapse; margin-top: 14px; }
            .info-table td { padding: 6px 10px; font-size: 10pt; border-bottom: 1px solid #f1f5f9; }
            .info-table .lbl { font-weight: 700; color: #475569; width: 22%; }
            .info-table .val { font-weight: 800; color: #0f172a; }
            .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0; }
            .sum-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; text-align: center; }
            .sum-val { font-size: 14pt; font-weight: 900; color: #1e3a8a; }
            .sum-lbl { font-size: 8pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
            .sub-table { width: 100%; border-collapse: collapse; margin-top: 14px; }
            .sub-table th { background: #1e3a8a; color: #fff; padding: 8px 10px; font-size: 9pt; text-transform: uppercase; text-align: left; }
            .sub-table td { padding: 8px 10px; font-size: 9.5pt; border-bottom: 1px solid #cbd5e1; }
            .sub-table tr:nth-child(even) td { background: #f8fafc; }
            .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; text-align: center; font-size: 9pt; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="sheet-border">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 450);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '850px', background: '#0c0a1f' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              Official Academic Marksheet Preview
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-accent" onClick={handlePrint} style={{ padding: '6px 14px' }}>
              <Printer size={16} /> Print / Save PDF
            </button>
            <button className="btn btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Container */}
        <div
          ref={printRef}
          style={{
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '8px',
            padding: '24px',
            border: '2px solid #cbd5e1',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* School Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '12px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e3a8a', letterSpacing: '1px' }}>
              🏫 OXFORD CONVENT SCHOOL SASARAM
            </div>
            <div style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 600 }}>
              Recognized CBSE Pattern Examination Board • Sasaram, Rohtas (Bihar)
            </div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {m.examType || 'PERIODIC TEST'} OFFICIAL SCORECARD & EVALUATION
            </div>
          </div>

          {/* Student Profile Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              padding: '14px 0',
              borderBottom: '1px solid #e2e8f0',
              fontSize: '0.88rem',
            }}
          >
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Student Name: </span>
              <strong style={{ color: '#1e3a8a', fontSize: '0.98rem' }}>{std.name || m.name || m.studentName || '-'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Roll Number: </span>
              <strong style={{ color: '#1e3a8a' }}>{std.rollNumber || m.rollNumber || '-'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Class & Section: </span>
              <strong>Class {std.class || m.class || '-'} {std.section ? `(Sec ${std.section})` : ''}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Academic Session: </span>
              <strong>{m.session || m.year || '2025-2026'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Evaluation Status: </span>
              <strong style={{ color: isPass ? '#16a34a' : '#dc2626' }}>
                {isPass ? 'PASSED ✅' : 'NEEDS REVISION ❌'}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Issue Date: </span>
              <strong>{new Date().toLocaleDateString('en-IN')}</strong>
            </div>
          </div>

          {/* Summary KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              margin: '14px 0',
              textAlign: 'center',
            }}
          >
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e3a8a' }}>
                {totals.securedMarks} / {totals.maxMarks}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Marks Obtained
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0284c7' }}>
                {totals.percentage}%
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Percentage
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#7c3aed' }}>
                {totals.grade}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                CBSE Grade
              </div>
            </div>
            <div
              style={{
                background: isPass ? '#f0fdf4' : '#fef2f2',
                padding: '10px',
                borderRadius: '6px',
                border: `1px solid ${isPass ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: isPass ? '#16a34a' : '#dc2626' }}>
                {totals.status}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Final Result
              </div>
            </div>
          </div>

          {/* Subjects Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ background: '#1e3a8a', color: '#ffffff' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: '0.8rem' }}>#</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: '0.8rem' }}>Subject Name</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.8rem' }}>Max Marks</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.8rem' }}>Passing Marks</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.8rem' }}>Marks Secured</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.8rem' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px', fontSize: '0.85rem' }}>{idx + 1}</td>
                  <td style={{ padding: '8px 10px', fontSize: '0.85rem', fontWeight: 700 }}>{s.subject}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.85rem' }}>{s.maxMarks}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.85rem' }}>{s.passingMarks || Math.round(s.maxMarks * 0.4)}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#1e3a8a' }}>
                    {s.securedMarks}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                    {s.grade || (s.securedMarks / s.maxMarks >= 0.8 ? 'A' : s.securedMarks / s.maxMarks >= 0.6 ? 'B' : 'C')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '45px',
              paddingTop: '16px',
              borderTop: '1px dashed #94a3b8',
              fontSize: '0.82rem',
              color: '#334155',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '30px' }}></div>
              <div style={{ borderTop: '1px solid #64748b', paddingTop: '4px', fontWeight: 700 }}>
                Class Teacher Signature
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#1e3a8a', fontWeight: 900, fontSize: '0.9rem', marginBottom: '2px' }}>
                [ VERIFIED SEAL ]
              </div>
              <div style={{ borderTop: '1px solid #64748b', paddingTop: '4px', fontWeight: 700 }}>
                Exam Controller / In-Charge
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '30px' }}></div>
              <div style={{ borderTop: '1px solid #64748b', paddingTop: '4px', fontWeight: 700 }}>
                Principal / Headmaster
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
