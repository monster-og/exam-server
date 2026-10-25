import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('userRole') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('userData');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync / Verify profile on initial mount
  useEffect(() => {
    async function verifySession() {
      try {
        const currentRole = localStorage.getItem('userRole');
        const studentToken = localStorage.getItem('studentToken');
        const adminToken = localStorage.getItem('adminToken');

        if (currentRole === 'student' && studentToken) {
          const res = await api.getStudentProfile();
          if (res && res.student) {
            setUser(res.student);
            setRole('student');
            localStorage.setItem('userData', JSON.stringify(res.student));
          }
        } else if ((currentRole === 'teacher' || currentRole === 'admin') && adminToken) {
          const res = await api.getTeacherProfile().catch(() => null);
          if (res && res.teacher) {
            setUser(res.teacher);
            setRole(currentRole);
            localStorage.setItem('userData', JSON.stringify(res.teacher));
          }
        }
      } catch (err) {
        console.warn('Session verification notice:', err.message);
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, []);

  const loginStudent = (token, studentData) => {
    localStorage.setItem('studentToken', token);
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userData', JSON.stringify(studentData));
    localStorage.removeItem('adminToken');
    setRole('student');
    setUser(studentData);
  };

  const loginStaff = (token, staffRole, staffData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('userRole', staffRole);
    localStorage.setItem('userData', JSON.stringify(staffData || { role: staffRole }));
    localStorage.removeItem('studentToken');
    setRole(staffRole);
    setUser(staffData || { role: staffRole });
  };

  const updateStudent = (newData) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem('userData', JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        loading,
        loginStudent,
        loginStaff,
        updateStudent,
        logout,
        isAuthenticated: !!role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
