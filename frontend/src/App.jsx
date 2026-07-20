import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import UserCreation from "./pages/UserCreation";
import ProtectedRoute from "./components/ProtectedRoute";

function PlaceholderPage({ title }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ padding: '30px' }}>
      <div style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
        border: isDark ? '1px solid rgba(90, 84, 224, 0.15)' : '1px solid rgba(59, 53, 201, 0.12)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'left',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(59, 53, 201, 0.05)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: 0,
          color: isDark ? '#ffffff' : '#1e1b7a'
        }}>{title}</h2>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={
            <Layout showSidebar={false}>
              <Login />
            </Layout>
          } />

          <Route path="/" element={
            <Layout showSidebar={false}>
              <Login />
            </Layout>
          } />

          {/* PROTECTED ROUTES */}
          <Route path="/admin_dashboard" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Layout>
                <PlaceholderPage title="Admin Dashboard" />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/user-creation" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Layout showSidebar={true}>
                <UserCreation />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/reporting_manager_dashboard" element={
            <ProtectedRoute allowedRoles={[4]}>
              <Layout>
                <PlaceholderPage title="Reporting Manager Dashboard" />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 404 Page */}
          <Route path="*" element={
            <Layout showSidebar={false}>
              <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-slate-800">404</h1>
                  <p className="text-slate-600 mt-2">Page not found</p>
                </div>
              </div>
            </Layout>
          } />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}
