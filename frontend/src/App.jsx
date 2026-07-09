import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookReader from './pages/BookReader';
import CustomCursor from './components/ui/custom-cursor';
import FloatingDock from './components/ui/floating-dock';

function App() {
  return (
    <ThemeProvider>
      <CustomCursor />
    <AuthProvider>
      <BookProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Shared Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected Student Routes */}
                <Route 
                  path="/student-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/read/:bookId" 
                  element={
                    <ProtectedRoute>
                      <BookReader />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected Admin Routes */}
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            {/* ── Floating Dock — global navigation ── */}
            <FloatingDock />
          </div>
        </Router>
      </BookProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
