import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

// Mock authentication state (you can replace this with your actual auth logic)
const isAuthenticated = true; // Change this to `false` to test the redirect

// ProtectedRoute component to restrict access to authenticated users only
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated ? element : <Navigate to="/login" />; // Redirect to login if not authenticated
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Route */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          
          {/* Redirect to login if the path doesn't match */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
