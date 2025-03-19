import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Users from "./Components/Admin/Users";
import { useAuth } from "./Components/Authentication/AuthContext";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import ResetPassword from "./Components/Authentication/ResetPassword";
import Navbar from "./Components/Navigation Bar/NavBar";
import About from "./Components/Pages/About";
import Dashboard from "./Components/Pages/Dashboard";
import Profile from "./Components/Pages/Profile";
import Prediction from "./Components/Prediction/Prediction";
import Welcome from "./Components/Welcome";

function App() {
    const { user } = useAuth() || {};
    const role = user?.role;

    return (
        <Router>
            <Navbar /> {/* ✅ Add Navbar */}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Welcome />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Role-Based Routes */}
                {role === "Admin" && (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/profile" element={<Profile />} />
                    </>
                )}
                {role === "Client" && (
                    <>
                        <Route path="/predict" element={<Prediction />} />
                        <Route path="/profile" element={<Profile />} />
                    </>
                )}

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;
