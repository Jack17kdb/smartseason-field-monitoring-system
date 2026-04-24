import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/useAuthStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFields from './pages/AdminFields';
import AgentDashboard from './pages/AgentDashboard';
import FieldDetail from './pages/FieldDetail';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingScreen />;

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#132618',
            color: '#e4f2e7',
            border: '1px solid rgba(58,150,70,0.2)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#3a9646', secondary: '#e4f2e7' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#e4f2e7' } },
        }}
      />
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />} />

        <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" replace />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" replace />} />
          <Route path="/admin/fields" element={isAdmin ? <AdminFields /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={!isAdmin ? <AgentDashboard /> : <Navigate to="/admin" replace />} />
          <Route path="/fields/:id" element={<FieldDetail />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
