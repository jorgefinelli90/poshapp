import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import BottomNav from './components/navigation/BottomNav';

const Home = React.lazy(() => import('./pages/Home'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Memories = React.lazy(() => import('./pages/Memories'));
const Lists = React.lazy(() => import('./pages/Lists'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <React.Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        }>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Home />
                  <BottomNav />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/calendar" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Calendar />
                  <BottomNav />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/memories" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Memories />
                  <BottomNav />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/lists" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Lists />
                  <BottomNav />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Settings />
                  <BottomNav />
                </div>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;