import React, { useState, useEffect, useRef } from 'react';
import { askNanduAI, SUGGESTED_DOUBTS, detectDiagram } from '../services/aiTutorService';
import EducationalDiagram from './EducationalDiagram';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  BookOpen, 
  GraduationCap, 
  HelpCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';

const SUBJECT_FILTERS = [
  { id: 'All', label: 'All Subjects' },
  { id: 'Mathematics', label: '📐 Mathematics' },
  { id: 'Science', label: '🔬 Science' },
  { id: 'Physics', label: '⚡ Physics' },
  { id: 'Biology', label: '🌿 Biology' },
  { id: 'Computer', label: '💻 Computer' },
  { id: 'English', label: '📖 English Grammar' },
  { id: 'Social Science', label: '🌍 Social Studies' },
];

export default function NanduAiTutorModal({ isOpen, onClose, studentClass = 'Class 10' }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ocs_nandu_chat_history_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init_1',
        sender: 'nandu',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Hello! I am **Nandu**, your AI Academic Tutor at **Oxford Convent School, Sasaram**.

I am ready to solve your doubts with step-by-step explanations, formulas, and visual diagrams across all subjects:
- 📐 **Mathematics**: Algebra, Trigonometry, Geometry, Arithmetic, Calculus
- 🔬 **Science**: Physics, Chemistry, Biology & Natural Phenomena
- 💻 **Computer Science**: Memory Architecture, Coding, Logic & IT
- 📖 **English Grammar**: All 12 Tenses, Rules, Voice & Structure
- 🌍 **Social Studies**: History, Civics, Geography & Economics

Please type your question or numerical problem below, or tap any of the suggested doubts to get started!`,
        diagram: null
      }
    ];
  });

  const [inputDoubt, setInputDoubt] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('ocs_nandu_chat_history_v2', JSON.stringify(messages));
    } catch {}
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputDoubt;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `std_${Date.now()}`,
      sender: 'student',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputDoubt('');
    setLoading(true);

    try {
      const res = await askNanduAI({
        doubt: textToSend.trim(),
        subject: selectedSubject !== 'All' ? selectedSubject : '',
        studentClass: studentClass,
        chatHistory: messages
      });

      // Extract [DIAGRAM: type] if embedded in text
      let cleanedText = res.answer;
      let detectedDiag = res.diagram;

      const diagMatch = cleanedText.match(/\[DIAGRAM:\s*([a-zA-Z0-9_-]+)\]/i);
      if (diagMatch) {
        cleanedText = cleanedText.replace(/\[DIAGRAM:\s*[a-zA-Z0-9_-]+\]/gi, '').trim();
        if (!detectedDiag) {
          detectedDiag = detectDiagram(textToSend, diagMatch[1]);
        }
      }

      const nanduMsg = {
        id: `nandu_${Date.now()}`,
        sender: 'nandu',
        text: cleanedText,
        source: res.source,
        diagram: detectedDiag,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, nanduMsg]);
    } catch (err) {
      const errMsg = {
        id: `err_${Date.now()}`,
        sender: 'nandu',
        text: '⚠️ Unable to connect to the AI tutor engine at this moment. Please re-submit your question or choose one of the suggested topics below.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all conversation history with Nandu?')) {
      const initial = [
        {
          id: 'init_fresh',
          sender: 'nandu',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `👋 Chat cleared! I am Nandu. What academic doubt can I solve for you today?`,
          diagram: null
        }
      ];
      setMessages(initial);
      localStorage.removeItem('ocs_nandu_chat_history_v2');
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 3, 15, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: isExpanded ? '96vw' : '820px',
          maxWidth: '100%',
          height: isExpanded ? '94vh' : '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, rgba(20, 16, 48, 0.98), rgba(9, 7, 24, 0.99))',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(99, 102, 241, 0.25)',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.25), rgba(6, 182, 212, 0.18))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                position: 'relative',
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
              }}
            >
              <Bot size={26} color="#fff" />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #0d0b20',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                  Nandu
                </h3>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.3)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  AI Smart Academic Tutor
                </span>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  🟢 24/7 Active
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Oxford Convent School • Maths, Science, English, SST &amp; Computer Doubts
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleClearChat}
              title="Clear chat history"
              className="btn btn-ghost"
              style={{ padding: '8px', color: 'var(--text-muted)' }}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Restore window size' : 'Expand full screen'}
              className="btn btn-ghost"
              style={{ padding: '8px', color: 'var(--text-muted)' }}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              title="Close Nandu"
              className="btn btn-ghost"
              style={{ padding: '8px', color: '#fff' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Subject Filter Tabs ── */}
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(12, 10, 28, 0.9)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Filter Subject:
          </span>
          {SUBJECT_FILTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.74rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                background: selectedSubject === s.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                color: selectedSubject === s.id ? '#fff' : 'var(--text-muted)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Chat Messages Stream ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                flexDirection: m.sender === 'student' ? 'row-reverse' : 'row',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    m.sender === 'student'
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  boxShadow:
                    m.sender === 'student'
                      ? '0 0 10px rgba(6, 182, 212, 0.4)'
                      : '0 0 10px rgba(99, 102, 241, 0.4)',
                  fontSize: '1rem',
                  color: '#fff',
                }}
              >
                {m.sender === 'student' ? '👨‍🎓' : <Bot size={20} />}
              </div>

              {/* Chat Bubble */}
              <div
                style={{
                  maxWidth: '85%',
                  background:
                    m.sender === 'student'
                      ? 'linear-gradient(135deg, #4f46e5, #4338ca)'
                      : 'rgba(28, 24, 58, 0.92)',
                  border:
                    m.sender === 'student'
                      ? '1px solid rgba(99, 102, 241, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: m.sender === 'student' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '14px 18px',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                }}
              >
                {/* Sender Title Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '8px',
                    fontSize: '0.72rem',
                    color: m.sender === 'student' ? '#c7d2fe' : 'var(--accent-light)',
                    fontWeight: 700,
                  }}
                >
                  <span>{m.sender === 'student' ? 'You (Student)' : 'Nandu (AI Academic Tutor)'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{m.time}</span>
                    {m.sender === 'nandu' && (
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        title="Copy answer"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedId === m.id ? '#10b981' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        {copiedId === m.id ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div
                  style={{
                    fontSize: '0.92rem',
                    lineHeight: '1.65',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.text}
                </div>

                {/* Educational Diagram / Illustration */}
                {m.diagram && (
                  <EducationalDiagram
                    type={m.diagram.type}
                    title={m.diagram.title}
                    caption={m.diagram.caption}
                    imageUrl={m.diagram.imageUrl}
                  />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} color="#fff" />
              </div>
              <div
                style={{
                  background: 'rgba(30, 26, 62, 0.85)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '18px 18px 18px 4px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--accent-light)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={16} className="animate-spin" />
                <span>Nandu is formulating a structured, step-by-step English solution with formulas...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggested Doubt Chips ── */}
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(15, 12, 35, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 800, whiteSpace: 'nowrap' }}>
            💡 Suggested Doubts:
          </span>
          {SUGGESTED_DOUBTS.map((q) => (
            <button
              key={q.id}
              onClick={() => handleSend(q.query)}
              disabled={loading}
              style={{
                background: 'rgba(99, 102, 241, 0.14)',
                color: '#e0e7ff',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                padding: '4px 12px',
                borderRadius: '14px',
                fontSize: '0.76rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.28)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.14)')}
            >
              {q.query}
            </button>
          ))}
        </div>

        {/* ── Input Box ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '14px 18px',
            background: 'rgba(10, 8, 22, 0.98)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Ask any question in English (e.g. Pythagoras Theorem, Photosynthesis, Newton's Laws)..."
            value={inputDoubt}
            onChange={(e) => setInputDoubt(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 18px',
              fontSize: '0.94rem',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.06)',
            }}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputDoubt.trim() || loading}
            style={{
              padding: '12px 22px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
            }}
          >
            <Send size={16} />
            <span>Ask Nandu</span>
          </button>
        </form>
      </div>
    </div>
  );
}
