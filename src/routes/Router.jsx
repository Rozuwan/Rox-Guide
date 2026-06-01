import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthProvider from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Topics from "../pages/Topics";
import TopicDetails from "../pages/TopicDetails";
import GuideDetails from "../pages/GuideDetails";

function RootRedirect() {
  const { currentUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return currentUser ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topics"
            element={
              <ProtectedRoute>
                <Topics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topic/:slug"
            element={
              <ProtectedRoute>
                <TopicDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/:slug"
            element={
              <ProtectedRoute>
                <GuideDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
