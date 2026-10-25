/**
 * API Service for Oxford Convent School Exam Portal
 */

const API_BASE = '/api';

function getStudentToken() {
  return localStorage.getItem('studentToken') || '';
}

function getAdminToken() {
  return localStorage.getItem('adminToken') || '';
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const studentToken = getStudentToken();
  if (studentToken && !headers['x-student-token']) {
    headers['x-student-token'] = studentToken;
  }

  const adminToken = getAdminToken();
  if (adminToken && !headers['x-admin-token']) {
    headers['x-admin-token'] = adminToken;
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });
    
    // Check if JSON
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || `Request to ${endpoint} failed with status ${res.status}`);
      }
      return data;
    } else {
      if (!res.ok) {
        throw new Error(`Request to ${endpoint} failed with status ${res.status}`);
      }
      return res;
    }
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Student Auth
  studentLogin: (data) => request('/students/login', { method: 'POST', body: JSON.stringify(data) }),
  studentRegister: (data) => request('/students/register', { method: 'POST', body: JSON.stringify(data) }),
  getStudentProfile: () => request('/students/me'),
  updateStudentProfile: (data) => request('/students/profile', { method: 'PUT', body: JSON.stringify(data) }),
  verifyForgotPassword: (data) => request('/students/forgot-password/verify', { method: 'POST', body: JSON.stringify(data) }),
  resetForgotPassword: (data) => request('/students/forgot-password/reset', { method: 'POST', body: JSON.stringify(data) }),
  
  // Student Exams & Results
  getStudentResults: () => request('/students/my-results'),
  getCumulativeMarksheet: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/students/cumulative-marksheet?${q}`);
  },

  // Staff Auth (Teacher & Admin)
  teacherLogin: (password) => request('/teachers/login', { method: 'POST', body: JSON.stringify({ password }) }),
  getTeacherProfile: () => request('/teachers/me'),
  adminLogin: (password) => request('/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),

  // Question Management & Exams
  getQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/questions${q ? `?${q}` : ''}`);
  },
  saveQuestions: (data) => request('/questions', { method: 'POST', body: JSON.stringify(data) }),
  deleteQuestions: (cls, subject) => request(`/questions/${encodeURIComponent(cls)}/${encodeURIComponent(subject)}`, { method: 'DELETE' }),
  getCbseSubjects: () => request('/cbse-subjects'),
  getSubjects: () => request('/subjects'),

  // Results & Exam Submissions
  submitExamResult: (resultData) => request('/results', { method: 'POST', body: JSON.stringify(resultData) }),
  getResults: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/results${q ? `?${q}` : ''}`);
  },
  checkPublicResult: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/results/check${q ? `?${q}` : ''}`);
  },
  getResultsDateSummary: () => request('/results/dates-summary'),
  deleteResult: (id) => request(`/results/${id}`, { method: 'DELETE' }),

  // Student Admin
  getAllStudents: () => request('/students'),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),

  // Excel & Email Tools
  exportExcelUrl: '/api/export/excel',
  exportTemplateUrl: '/api/export/template',
  importExcel: (formData) => request('/import/excel', { method: 'POST', body: formData }),
  sendEmail: (data) => request('/email/send', { method: 'POST', body: JSON.stringify(data) }),

  // Chatbot
  askChatbot: (message) => request('/chatbot', { method: 'POST', body: JSON.stringify({ message }) }),
};

export default api;
