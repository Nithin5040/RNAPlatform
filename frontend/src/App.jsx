import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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
