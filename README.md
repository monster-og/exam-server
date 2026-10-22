# Exam Server

An intelligent web-based Online Examination and Assessment System built with Node.js and Express.

## Features
- **Student Examination Portal**: Timed test taking, auto-saving, anti-cheat mechanisms.
- **Student Dashboard**: Performance tracking, score review, downloadable result cards.
- **Teacher Dashboard**: Question bank management, student monitoring, and evaluation.
- **Admin Panel**: Complete system administration, teacher and student user management.
- **AI-Powered Evaluation**: Automated grading assistance using Google Gemini AI.
- **Excel Export & Import**: Bulk student and question management, exportable grade sheets.
- **Automated Notifications**: Email result notifications via Nodemailer.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- npm

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/monster-og/exam-server.git
   cd exam-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your desired credentials, port, and Gemini API key.

## Running the Application
Start the server:
```bash
npm start
```
Or on Windows:
```cmd
start_server.bat
```

Access the system in your browser at `http://localhost:2011` (or your configured `PORT`).
