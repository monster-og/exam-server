import React, { useState } from 'react';
import { Maximize2, Minimize2, Image as ImageIcon } from 'lucide-react';

/**
 * Educational Diagrams Component
 * Renders high-definition, responsive vector SVG diagrams and illustrations
 * for Mathematics, Physics, Chemistry, Biology, and Computer Science.
 */
export default function EducationalDiagram({ type, title, caption, imageUrl }) {
  const [zoomed, setZoomed] = useState(false);

  // If a standard web image URL is provided
  if (imageUrl) {
    return (
      <div
        className="educational-diagram-box"
        style={{
          marginTop: '12px',
          marginBottom: '12px',
          background: 'rgba(10, 8, 28, 0.9)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '14px',
          padding: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#67e8f9', fontWeight: 700 }}>
            <ImageIcon size={15} /> {title || 'Academic Diagram'}
          </div>
          <button
            onClick={() => setZoomed(!zoomed)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            title={zoomed ? 'Shrink' : 'Enlarge'}
          >
            {zoomed ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img
            src={imageUrl}
            alt={title || 'Educational Illustration'}
            style={{
              maxWidth: '100%',
              maxHeight: zoomed ? '500px' : '260px',
              borderRadius: '8px',
              objectFit: 'contain',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
            }}
          />
        </div>
        {caption && (
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center', fontStyle: 'italic' }}>
            {caption}
          </div>
        )}
      </div>
    );
  }

  // Render SVG diagram based on type
  const renderSvg = () => {
    switch (type) {
      case 'pythagoras_triangle':
        return (
          <svg viewBox="0 0 460 260" style={{ width: '100%', maxHeight: zoomed ? '420px' : '240px' }}>
            <defs>
              <linearGradient id="hypoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            {/* Background Grid */}
            <rect width="460" height="260" rx="12" fill="#0c0a20" />
            <path d="M 60,40 L 60,200 L 360,200 Z" fill="rgba(99, 102, 241, 0.12)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
            
            {/* Right Angle Symbol at (60, 200) */}
            <rect x="60" y="176" width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="72" cy="188" r="2.5" fill="#f59e0b" />
            
            {/* Perpendicular: Vertical side (60,40) to (60,200) */}
            <line x1="60" y1="40" x2="60" y2="200" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
            
            {/* Base: Horizontal side (60,200) to (360,200) */}
            <line x1="60" y1="200" x2="360" y2="200" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
            
            {/* Hypotenuse: Diagonal (60,40) to (360,200) */}
            <line x1="60" y1="40" x2="360" y2="200" stroke="url(#hypoGrad)" strokeWidth="5" strokeLinecap="round" />
            
            {/* Vertex Dots */}
            <circle cx="60" cy="40" r="5" fill="#a855f7" />
            <circle cx="60" cy="200" r="5" fill="#f59e0b" />
            <circle cx="360" cy="200" r="5" fill="#06b6d4" />
            
            {/* Labels */}
            <text x="45" y="35" fill="#fff" fontSize="14" fontWeight="800">A</text>
            <text x="42" y="215" fill="#fff" fontSize="14" fontWeight="800">B (90°)</text>
            <text x="370" y="215" fill="#fff" fontSize="14" fontWeight="800">C</text>
            
            {/* Side Lengths & Names */}
            <text x="18" y="125" fill="#c084fc" fontSize="12" fontWeight="700">Perpendicular</text>
            <text x="22" y="142" fill="#e9d5ff" fontSize="13" fontWeight="800">P = 4 cm</text>
            
            <text x="180" y="226" fill="#67e8f9" fontSize="12" fontWeight="700">Base (B = 3 cm)</text>
            
            <text x="225" y="105" fill="#34d399" fontSize="13" fontWeight="900" transform="rotate(27 225 105)">
              Hypotenuse H = 5 cm
            </text>
            
            {/* Formula Badge */}
            <rect x="250" y="25" width="190" height="48" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.5" />
            <text x="345" y="44" fill="#6ee7b7" fontSize="12" fontWeight="700" textAnchor="middle">Pythagoras Formula</text>
            <text x="345" y="62" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">H² = P² + B² (5² = 4² + 3²)</text>
          </svg>
        );

      case 'photosynthesis':
        return (
          <svg viewBox="0 0 460 260" style={{ width: '100%', maxHeight: zoomed ? '420px' : '240px' }}>
            <rect width="460" height="260" rx="12" fill="#09101d" />
            
            {/* Sun Rays */}
            <circle cx="80" cy="65" r="30" fill="#f59e0b" filter="drop-shadow(0 0 15px rgba(245, 158, 11, 0.8))" />
            <text x="80" y="70" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">Sunlight</text>
            
            {/* Sunlight Beam Arrow */}
            <line x1="115" y1="85" x2="190" y2="130" stroke="#fbbf24" strokeWidth="3" strokeDasharray="5,5" />
            <polygon points="190,130 180,123 183,133" fill="#fbbf24" />
            
            {/* Green Leaf Body */}
            <path d="M 180,170 C 170,100 280,100 320,165 C 290,210 200,210 180,170 Z" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
            <path d="M 180,170 C 230,160 270,165 320,165" stroke="#34d399" strokeWidth="2.5" />
            <text x="245" y="152" fill="#a7f3d0" fontSize="12" fontWeight="800" textAnchor="middle">Chloroplast (Leaf)</text>
            
            {/* Inputs: Carbon Dioxide + Water */}
            <rect x="130" y="18" width="95" height="28" rx="6" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" />
            <text x="177" y="36" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle">CO₂ (Air)</text>
            <line x1="177" y1="46" x2="220" y2="115" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
            
            <rect x="110" y="215" width="105" height="28" rx="6" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" />
            <text x="162" y="233" fill="#67e8f9" fontSize="11" fontWeight="800" textAnchor="middle">H₂O (Water/Soil)</text>
            <line x1="162" y1="215" x2="210" y2="185" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" />
            
            {/* Outputs: Glucose + Oxygen */}
            <rect x="330" y="115" width="115" height="32" rx="6" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" />
            <text x="387" y="135" fill="#fda4af" fontSize="11" fontWeight="800" textAnchor="middle">Glucose (C₆H₁₂O₆)</text>
            <line x1="305" y1="150" x2="330" y2="135" stroke="#f43f5e" strokeWidth="2" />
            
            <rect x="330" y="175" width="115" height="32" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" />
            <text x="387" y="195" fill="#6ee7b7" fontSize="11" fontWeight="800" textAnchor="middle">Oxygen (O₂) Released</text>
            <line x1="305" y1="175" x2="330" y2="188" stroke="#10b981" strokeWidth="2" />
            
            {/* Reaction Formula Header */}
            <rect x="15" y="215" width="85" height="28" rx="6" fill="#1e1b4b" stroke="#6366f1" />
            <text x="57" y="233" fill="#c7d2fe" fontSize="10" fontWeight="700" textAnchor="middle">Light Energy</text>
          </svg>
        );

      case 'newton_laws':
        return (
          <svg viewBox="0 0 460 260" style={{ width: '100%', maxHeight: zoomed ? '420px' : '240px' }}>
            <rect width="460" height="260" rx="12" fill="#0d0b20" />
            
            {/* Section 1: Inertia */}
            <rect x="15" y="18" width="135" height="224" rx="8" fill="rgba(99, 102, 241, 0.1)" stroke="rgba(99, 102, 241, 0.4)" />
            <text x="82" y="42" fill="#a5b4fc" fontSize="12" fontWeight="900" textAnchor="middle">1st Law: Inertia</text>
            <rect x="52" y="90" width="60" height="45" rx="6" fill="#4f46e5" />
            <text x="82" y="117" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">Mass (m)</text>
            <text x="82" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">v = 0 (At Rest)</text>
            <text x="82" y="180" fill="#c7d2fe" fontSize="10" fontWeight="700" textAnchor="middle">Stays at rest</text>
            <text x="82" y="196" fill="#c7d2fe" fontSize="10" textAnchor="middle">unless F_ext acts</text>
            
            {/* Section 2: F = ma */}
            <rect x="162" y="18" width="135" height="224" rx="8" fill="rgba(6, 182, 212, 0.1)" stroke="rgba(6, 182, 212, 0.4)" />
            <text x="229" y="42" fill="#67e8f9" fontSize="12" fontWeight="900" textAnchor="middle">2nd Law: F = m × a</text>
            <rect x="195" y="90" width="55" height="45" rx="6" fill="#0891b2" />
            <text x="222" y="117" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">m</text>
            {/* Force arrow */}
            <line x1="168" y1="112" x2="190" y2="112" stroke="#f59e0b" strokeWidth="4" />
            <polygon points="193,112 186,108 186,116" fill="#f59e0b" />
            <text x="175" y="102" fill="#f59e0b" fontSize="10" fontWeight="800">Force</text>
            {/* Accel arrow */}
            <line x1="255" y1="112" x2="285" y2="112" stroke="#10b981" strokeWidth="3" />
            <polygon points="288,112 281,108 281,116" fill="#10b981" />
            <text x="268" y="102" fill="#34d399" fontSize="10" fontWeight="800">Accel (a)</text>
            <text x="229" y="165" fill="#a5f3fc" fontSize="11" fontWeight="800" textAnchor="middle">Force = Mass × Accel</text>
            <text x="229" y="185" fill="#94a3b8" fontSize="10" textAnchor="middle">1 Newton = 1 kg·m/s²</text>
            
            {/* Section 3: Action-Reaction */}
            <rect x="310" y="18" width="135" height="224" rx="8" fill="rgba(244, 63, 94, 0.1)" stroke="rgba(244, 63, 94, 0.4)" />
            <text x="377" y="42" fill="#fda4af" fontSize="12" fontWeight="900" textAnchor="middle">3rd Law: Action &amp; Rxn</text>
            {/* Two interacting bodies */}
            <circle cx="355" cy="112" r="22" fill="#e11d48" />
            <text x="355" y="116" fill="#fff" fontSize="10" fontWeight="800" textAnchor="middle">Body A</text>
            <circle cx="400" cy="112" r="22" fill="#2563eb" />
            <text x="400" y="116" fill="#fff" fontSize="10" fontWeight="800" textAnchor="middle">Body B</text>
            
            <line x1="355" y1="145" x2="330" y2="145" stroke="#f43f5e" strokeWidth="3" />
            <polygon points="328,145 334,141 334,149" fill="#f43f5e" />
            <text x="338" y="160" fill="#f43f5e" fontSize="9" fontWeight="800">F_BA</text>
            
            <line x1="400" y1="145" x2="425" y2="145" stroke="#3b82f6" strokeWidth="3" />
            <polygon points="427,145 421,141 421,149" fill="#3b82f6" />
            <text x="405" y="160" fill="#3b82f6" fontSize="9" fontWeight="800">F_AB</text>
            
            <text x="377" y="185" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">F_Action = - F_Reaction</text>
            <text x="377" y="202" fill="#94a3b8" fontSize="10" textAnchor="middle">Equal and Opposite</text>
          </svg>
        );

      case 'quadratic_parabola':
        return (
          <svg viewBox="0 0 460 260" style={{ width: '100%', maxHeight: zoomed ? '420px' : '240px' }}>
            <rect width="460" height="260" rx="12" fill="#080e1c" />
            {/* Grid Axes */}
            <line x1="40" y1="170" x2="420" y2="170" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
            <line x1="230" y1="20" x2="230" y2="240" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
            <text x="415" y="165" fill="#94a3b8" fontSize="11" fontWeight="700">X</text>
            <text x="235" y="32" fill="#94a3b8" fontSize="11" fontWeight="700">Y</text>
            
            {/* Parabola Curve y = a(x-h)^2 + k */}
            <path d="M 90,40 Q 230,260 370,40" fill="none" stroke="#6366f1" strokeWidth="4" />
            
            {/* Roots: Intersect with X-axis */}
            <circle cx="150" cy="170" r="5" fill="#10b981" />
            <text x="140" y="192" fill="#34d399" fontSize="12" fontWeight="800">Root α (x₁)</text>
            
            <circle cx="310" cy="170" r="5" fill="#10b981" />
            <text x="300" y="192" fill="#34d399" fontSize="12" fontWeight="800">Root β (x₂)</text>
            
            {/* Vertex Point */}
            <circle cx="230" cy="195" r="5" fill="#f59e0b" />
            <text x="240" y="215" fill="#fbbf24" fontSize="11" fontWeight="800">Vertex (-b/2a, -D/4a)</text>
            
            {/* Formula Header Card */}
            <rect x="50" y="25" width="160" height="42" rx="6" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
            <text x="130" y="42" fill="#c7d2fe" fontSize="10" fontWeight="700" textAnchor="middle">Standard Form</text>
            <text x="130" y="58" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">ax² + bx + c = 0</text>
            
            <rect x="250" y="25" width="175" height="42" rx="6" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
            <text x="337" y="42" fill="#a7f3d0" fontSize="10" fontWeight="700" textAnchor="middle">Quadratic Formula</text>
            <text x="337" y="58" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">x = (-b ± √D) / 2a</text>
          </svg>
        );

      case 'electric_circuit':
        return (
          <svg viewBox="0 0 460 260" style={{ width: '100%', maxHeight: zoomed ? '420px' : '240px' }}>
            <rect width="460" height="260" rx="12" fill="#0b0e1e" />
            
            {/* Wire Loop */}
            <rect x="70" y="50" width="320" height="150" fill="none" stroke="#38bdf8" strokeWidth="3" rx="12" />
            
            {/* DC Battery Symbol on top line (200, 50) */}
            <rect x="195" y="40" width="60" height="20" fill="#0b0e1e" />
            <line x1="215" y1="35" x2="215" y2="65" stroke="#f59e0b" strokeWidth="4" />
            <line x1="235" y1="42" x2="235" y2="58" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="200" y="32" fill="#f59e0b" fontSize="12" fontWeight="900">+</text>
            <text x="245" y="32" fill="#f59e0b" fontSize="12" fontWeight="900">-</text>
            <text x="225" y="22" fill="#fde047" fontSize="11" fontWeight="800" textAnchor="middle">Battery (Voltage V)</text>
            
            {/* Resistor Symbol on bottom line (230, 200) */}
            <rect x="190" y="190" width="80" height="20" fill="#0b0e1e" />
            <path d="M 190,200 L 200,190 L 210,210 L 220,190 L 230,210 L 240,190 L 250,210 L 260,190 L 270,200" fill="none" stroke="#f43f5e" strokeWidth="3" />
            <text x="230" y="235" fill="#fda4af" fontSize="11" fontWeight="800" textAnchor="middle">Resistor (Resistance R Ω)</text>
            
            {/* Current Arrow on right branch */}
            <line x1="390" y1="110" x2="390" y2="140" stroke="#10b981" strokeWidth="3" />
            <polygon points="390,145 385,135 395,135" fill="#10b981" />
            <text x="415" y="132" fill="#34d399" fontSize="11" fontWeight="800">Current (I)</text>
            
            {/* Ohm's Law Formula Card */}
            <rect x="85" y="80" width="105" height="90" rx="8" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" />
            <text x="137" y="105" fill="#67e8f9" fontSize="11" fontWeight="900" textAnchor="middle">Ohm's Law</text>
            <text x="137" y="128" fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">V = I × R</text>
            <text x="137" y="146" fill="#94a3b8" fontSize="10" textAnchor="middle">I = V / R</text>
            <text x="137" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">R = V / I</text>
          </svg>
        );

      case 'ram_vs_rom':
        return (
          <svg viewBox="0 0 460 260" style={{ width: '100%', maxHeight: zoomed ? '420px' : '240px' }}>
            <rect width="460" height="260" rx="12" fill="#0a0c1a" />
            
            {/* RAM Box */}
            <rect x="25" y="30" width="190" height="200" rx="10" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
            <text x="120" y="58" fill="#a5b4fc" fontSize="14" fontWeight="900" textAnchor="middle">⚡ RAM (Random Access)</text>
            <text x="45" y="90" fill="#38bdf8" fontSize="11" fontWeight="700">• Volatile Memory</text>
            <text x="45" y="112" fill="#94a3b8" fontSize="10">(Erased when power OFF)</text>
            <text x="45" y="136" fill="#38bdf8" fontSize="11" fontWeight="700">• Read &amp; Write enabled</text>
            <text x="45" y="158" fill="#38bdf8" fontSize="11" fontWeight="700">• High Speed execution</text>
            <text x="45" y="180" fill="#94a3b8" fontSize="10">Stores currently active apps</text>
            <text x="45" y="205" fill="#a7f3d0" fontSize="11" fontWeight="800">Analogy: School Blackboard</text>
            
            {/* ROM Box */}
            <rect x="245" y="30" width="190" height="200" rx="10" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2" />
            <text x="340" y="58" fill="#6ee7b7" fontSize="14" fontWeight="900" textAnchor="middle">💾 ROM (Read-Only)</text>
            <text x="265" y="90" fill="#fde047" fontSize="11" fontWeight="700">• Non-Volatile Memory</text>
            <text x="265" y="112" fill="#94a3b8" fontSize="10">(Permanent data preserved)</text>
            <text x="265" y="136" fill="#fde047" fontSize="11" fontWeight="700">• Read-Only by CPU</text>
            <text x="265" y="158" fill="#fde047" fontSize="11" fontWeight="700">• Moderate Speed</text>
            <text x="265" y="180" fill="#94a3b8" fontSize="10">Stores BIOS / Boot firmware</text>
            <text x="265" y="205" fill="#fda4af" fontSize="11" fontWeight="800">Analogy: Printed Textbook</text>
          </svg>
        );

      case 'tenses_timeline':
        return (
          <svg viewBox="0 0 460 260" style={{ width: '100%', maxHeight: zoomed ? '420px' : '240px' }}>
            <rect width="460" height="260" rx="12" fill="#0e0c24" />
            
            {/* Main Timeline Bar */}
            <line x1="40" y1="120" x2="420" y2="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="4" />
            <polygon points="425,120 415,114 415,126" fill="#fff" />
            
            {/* Past Node */}
            <circle cx="100" cy="120" r="14" fill="#6366f1" />
            <text x="100" y="85" fill="#a5b4fc" fontSize="14" fontWeight="900" textAnchor="middle">PAST</text>
            <text x="100" y="155" fill="#c7d2fe" fontSize="10" textAnchor="middle">Simple: V2 (played)</text>
            <text x="100" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">Cont: was/were+V4</text>
            <text x="100" y="189" fill="#94a3b8" fontSize="10" textAnchor="middle">Perf: had + V3</text>
            
            {/* Present Node */}
            <circle cx="230" cy="120" r="16" fill="#10b981" />
            <text x="230" y="80" fill="#34d399" fontSize="15" fontWeight="900" textAnchor="middle">PRESENT (Now)</text>
            <text x="230" y="155" fill="#a7f3d0" fontSize="10" textAnchor="middle">Simple: V1(s/es)</text>
            <text x="230" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">Cont: is/am/are+V4</text>
            <text x="230" y="189" fill="#94a3b8" fontSize="10" textAnchor="middle">Perf: has/have + V3</text>
            
            {/* Future Node */}
            <circle cx="360" cy="120" r="14" fill="#06b6d4" />
            <text x="360" y="85" fill="#67e8f9" fontSize="14" fontWeight="900" textAnchor="middle">FUTURE</text>
            <text x="360" y="155" fill="#bae6fd" fontSize="10" textAnchor="middle">Simple: will + V1</text>
            <text x="360" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">Cont: will be + V4</text>
            <text x="360" y="189" fill="#94a3b8" fontSize="10" textAnchor="middle">Perf: will have + V3</text>
            
            {/* Header Title */}
            <text x="230" y="35" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">
              Master English Tenses Flowchart
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  const svgContent = renderSvg();
  if (!svgContent) return null;

  return (
    <div
      className="educational-diagram-box"
      style={{
        marginTop: '12px',
        marginBottom: '12px',
        background: 'rgba(12, 10, 30, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        borderRadius: '14px',
        padding: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 800 }}>
          <span>📐</span> {title || 'Academic Visual Illustration'}
        </div>
        <button
          onClick={() => setZoomed(!zoomed)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
          title={zoomed ? 'Minimize Diagram' : 'Expand Diagram'}
        >
          {zoomed ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      <div style={{ textAlign: 'center', width: '100%', overflowX: 'auto' }}>
        {svgContent}
      </div>

      {caption && (
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center', fontStyle: 'italic' }}>
          {caption}
        </div>
      )}
    </div>
  );
}
