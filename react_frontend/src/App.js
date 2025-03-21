import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Users from "./Components/Admin/Users";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import ResetPassword from "./Components/Authentication/ResetPassword";
import VerifyEmail from "./Components/Authentication/VerifyEmail";
import Navbar from "./Components/Navigation Bar/NavBar";
import About from "./Components/Pages/About";
import Dashboard from "./Components/Pages/Dashboard";
import Profile from "./Components/Pages/Profile";
import Prediction from "./Components/Prediction/Prediction";
import Welcome from "./Components/Welcome";

function App() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || null;

    // Hide Navbar on these pages
    const hideNavbarRoutes = ["/"];
    const showNavbar = !hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Welcome />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-code" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Admin Routes */}
                {role === "Admin" && (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/profile" element={<Profile />} />
                    </>
                )}

                {/* Client Routes */}
                {role === "Client" && (
                    <>
                        <Route path="/predict" element={<Prediction />} />
                        <Route path="/profile" element={<Profile />} />
                    </>
                )}

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} replace />} />
            </Routes>
        </>
    );
}

export default App;
