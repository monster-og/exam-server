# Oxford Convent School, Sasaram — Online Examination Portal (React + Vite)

A modern, high-performance, standalone web-based Online Examination and Assessment System built with **React 19** and **Vite 8**.

## 🌟 Key Features
- **100% Standalone React + Vite**: Zero external backend required. All authentication, exam timing, automatic AI scoring, and marksheets run natively in the browser with local persistence.
- **Student Examination Portal**: Real-time countdown timer, proctoring/tab-switch detection, review bookmarks, and instant AI evaluation.
- **Student Dashboard**: Performance tracking, subject test archives, and official CBSE report cards.
- **Teacher Dashboard**: Question paper creator (MCQ, True/False, One-Word Answers), student roster, and submission reviews.
- **Admin Command Center**: System configuration, roster controls, result publishing, and CSV data export.
- **Public Result Checker**: Instant verified scorecard search by Roll Number & Class.
- **Official A4 CBSE Marksheets**: Print and PDF-ready consolidated report cards.

---

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/monster-og/exam-server.git
cd exam-server
npm install
```

### 2. Run Locally
Start the development server:
```bash
npm run dev
```

Open your browser at **`http://localhost:5173/`**.

---

## 🔑 Default Login Credentials

| Role | Identifier / Roll Number | Class | Password |
|---|---|---|---|
| **Student** | `1` (or `8589956288` / `vk153289@gmail.com`) | `Class 10` | `Vinit@2026` |
| **Student (12th)** | `7557760465` (or `expertprince01@gmail.com`) | `12th Science` | `1131321` |
| **Teacher** | Any | Any | `Teacher@2011` (or `teacher123`) |
| **Admin** | Any | Any | `Principal@2011` (or `admin123`) |

---

## 📦 Production Build
To generate the optimized production bundle:
```bash
npm run build
```
The output will be created in `dist/`, ready to deploy anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
