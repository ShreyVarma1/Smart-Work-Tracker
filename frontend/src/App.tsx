import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getStoredUser, getToken, logout } from "./services/authService";
import type { User } from "./types/task";

function App() {
  // Initialise auth state from localStorage so refresh keeps user logged in
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getToken);

  const isAuthenticated = !!user && !!token;

  function handleLogin(loggedInUser: User, accessToken: string) {
    setUser(loggedInUser);
    setToken(accessToken);
  }

  function handleLogout() {
    logout();
    setUser(null);
    setToken(null);
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Register onLogin={handleLogin} />
          }
        />

        {/* Protected route */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
