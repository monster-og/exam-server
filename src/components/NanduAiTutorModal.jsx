import React, { useState, useEffect, useRef } from 'react';
import { 
  askNanduAI, 
  SUGGESTED_DOUBTS, 
  detectDiagram,
  getPreferredAIProvider,
  setAIProviderConfig,
  getGeminiKey,
  getOpenAIKey,
  testAIConnection
} from '../services/aiTutorService';
import EducationalDiagram from './EducationalDiagram';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Maximize2,
  Minimize2,
  Settings,
  Key,
  Cpu,
  CheckCircle2,
  AlertCircle
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

Connected directly to **Google Gemini AI & ChatGPT** to solve your doubts with accurate formulas, step-by-step solutions, and visual diagrams:
- 📐 **Mathematics**: Algebra, Trigonometry, Geometry, Arithmetic, Calculus
- 🔬 **Science**: Physics, Chemistry, Biology & Natural Phenomena
- 💻 **Computer Science**: Memory Architecture, Coding, Logic & IT
- 📖 **English Grammar**: All 12 Tenses, Rules, Voice & Structure
- 🌍 **Social Studies**: History, Civics, Geography & Economics

Please type your question or numerical problem below, or tap any of the suggested doubts to get started!`,
        source: 'gemini_ai',
        providerName: 'Google Gemini 3.5 AI',
        diagram: null
      }
    ];
  });

  const [inputDoubt, setInputDoubt] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // AI Engine Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [activeProvider, setActiveProvider] = useState(() => getPreferredAIProvider());
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => localStorage.getItem('ocs_gemini_api_key') || '');
  const [openAIKeyInput, setOpenAIKeyInput] = useState(() => localStorage.getItem('ocs_openai_api_key') || '');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

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
        providerName: res.providerName || (res.source === 'chatgpt_ai' ? 'OpenAI ChatGPT' : 'Google Gemini AI'),
        diagram: detectedDiag,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, nanduMsg]);
    } catch (err) {
      const errMsg = {
        id: `err_${Date.now()}`,
        sender: 'nandu',
        text: '⚠️ Unable to connect to the AI tutor engine at this moment. Please re-submit your question or choose one of the suggested topics below.',
        source: 'local_engine',
        providerName: 'Oxford Academic Base',
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
          source: 'gemini_ai',
          providerName: 'Google Gemini 3.5 AI',
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

  // Test and save API Key
  const handleTestAndSave = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      setAIProviderConfig({
        provider: activeProvider,
        geminiKey: geminiKeyInput,
        openAIKey: openAIKeyInput
      });

      const res = await testAIConnection({
        provider: activeProvider,
        apiKey: activeProvider === 'openai' ? openAIKeyInput : (geminiKeyInput || getGeminiKey())
      });

      setTestResult({
        success: true,
        message: `✅ Connected to ${res.provider} (${res.model}) successfully! Responses are live.`
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: `❌ Connection failed: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
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
          width: isExpanded ? '96vw' : '840px',
          maxWidth: '100%',
          height: isExpanded ? '94vh' : '86vh',
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
            flexWrap: 'wrap',
            gap: '12px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                  AI Academic Tutor
                </span>
                <span
                  style={{
                    background: activeProvider === 'openai' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                    color: activeProvider === 'openai' ? '#34d399' : '#67e8f9',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  ⚡ {activeProvider === 'openai' ? 'ChatGPT (GPT-4o)' : 'Google Gemini 3.5'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Oxford Convent School • Instant Doubts in Maths, Science, English, SST &amp; Computer
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              title="Configure Gemini & ChatGPT API Keys"
              className={`btn ${showSettings ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Key size={15} />
              <span>AI Access</span>
            </button>
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

        {/* ── AI Access & API Key Settings Drawer (Collapsible) ── */}
        {showSettings && (
          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(15, 12, 38, 0.98)',
              borderBottom: '1px solid rgba(99, 102, 241, 0.35)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800, fontSize: '0.92rem' }}>
                <Cpu size={18} color="#67e8f9" /> AI Engine Configuration &amp; API Keys
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Direct LLM Access (Google Gemini &amp; OpenAI ChatGPT)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              {/* Provider Selection */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Select Primary AI Engine:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveProvider('gemini')}
                    className={`btn ${activeProvider === 'gemini' ? 'btn-primary' : 'btn-surface'}`}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    Google Gemini AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProvider('openai')}
                    className={`btn ${activeProvider === 'openai' ? 'btn-primary' : 'btn-surface'}`}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    OpenAI ChatGPT
                  </button>
                </div>
              </div>

              {/* Gemini Key */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Google Gemini API Key:
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={geminiKeyInput ? '••••••••••••••••' : 'Using School Default Key (Active 🟢)'}
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  style={{ fontSize: '0.84rem', padding: '8px 12px', borderRadius: '8px' }}
                />
              </div>

              {/* OpenAI Key */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  OpenAI API Key (Optional for ChatGPT):
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Paste sk-... key to activate ChatGPT"
                  value={openAIKeyInput}
                  onChange={(e) => setOpenAIKeyInput(e.target.value)}
                  style={{ fontSize: '0.84rem', padding: '8px 12px', borderRadius: '8px' }}
                />
              </div>
            </div>

            {/* Test Status Banner */}
            {testResult && (
              <div
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${testResult.success ? '#10b981' : '#ef4444'}`,
                  color: testResult.success ? '#34d399' : '#f87171',
                }}
              >
                {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{testResult.message}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowSettings(false)}
                style={{ fontSize: '0.84rem', padding: '6px 14px' }}
              >
                Close Settings
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleTestAndSave}
                disabled={testing}
                style={{ fontSize: '0.84rem', padding: '6px 16px', fontWeight: 700 }}
              >
                {testing ? 'Testing Connection...' : 'Test & Save Configuration'}
              </button>
            </div>
          </div>
        )}

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
                      : 'rgba(28, 24, 58, 0.94)',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span>{m.sender === 'student' ? 'You (Student)' : 'Nandu (AI Tutor)'}</span>
                    {m.sender === 'nandu' && (
                      <span
                        style={{
                          background: m.source === 'chatgpt_ai' 
                            ? 'rgba(16, 185, 129, 0.22)' 
                            : m.source === 'gemini_ai' 
                              ? 'rgba(6, 182, 212, 0.22)' 
                              : 'rgba(99, 102, 241, 0.22)',
                          color: m.source === 'chatgpt_ai' ? '#34d399' : m.source === 'gemini_ai' ? '#67e8f9' : '#a5b4fc',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          padding: '1px 8px',
                          borderRadius: '10px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Sparkles size={11} /> {m.providerName || (m.source === 'gemini_ai' ? 'Google Gemini AI' : m.source === 'chatgpt_ai' ? 'OpenAI ChatGPT' : 'Oxford Academic Engine')}
                      </span>
                    )}
                  </div>

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
                <span>Nandu is asking {activeProvider === 'openai' ? 'OpenAI ChatGPT' : 'Google Gemini 3.5 AI'} to formulate your solution...</span>
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
