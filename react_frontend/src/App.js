import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AddUsers from "./Components/Admin/AddUser";
import AnswerQueryPopup from "./Components/Admin/AnswerQueryPopup";
import EditUserPopup from "./Components/Admin/EditUserPopup";
import ReportPage from "./Components/Admin/ReportPage";
import QueryHistory from "./Components/Admin/ViewQuery";
import Users from "./Components/Admin/ViewUsers";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import ResetPassword from "./Components/Authentication/ResetPassword";
import VerifyEmail from "./Components/Authentication/VerifyEmail";
import Footer from "./Components/Navigation Bar/Footer";
import Navbar from "./Components/Navigation Bar/NavBar";
import ProfileContainer from "./Components/Navigation Bar/ProfileContainer";
import Dashboard from "./Components/Pages/Dashboard";
import Home from "./Components/Pages/Home";
import Profile from "./Components/Pages/Profile";
import Compare from "./Components/Prediction/Compare";
import Prediction from "./Components/Prediction/Prediction";
import PredictionHistory from "./Components/Prediction/PredictionHistory";
import Welcome from "./Components/Welcome";

function App() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || null;

    // Hide Navbar & Footer on specific routes
    const hiddenRoutes = ["/"];
    const showNavbar = !hiddenRoutes.includes(location.pathname);
    const showFooter = !hiddenRoutes.includes(location.pathname);

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Show ProfileContainer only when the user is logged in and not on the Welcome page */}
            {user && !hiddenRoutes.includes(location.pathname) && <ProfileContainer />}

            {showNavbar && <Navbar />}
            <div className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/home" element={<Home />} />
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
                            <Route path="/add-users" element={<AddUsers />} />
                            <Route path="/edit-user" element={<EditUserPopup />} />
                            <Route path="/query-history" element={<QueryHistory />} />
                            <Route path="/report" element={<ReportPage />} />
                            <Route path="/answer-query" element={<AnswerQueryPopup />} />
                        </>
                    )}

                    {/* Client Routes */}
                    {role === "Client" && (
                        <>
                            <Route path="/predict" element={<Prediction />} />
                            <Route path="/compare" element={<Compare />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/predict-history" element={<PredictionHistory />} />
                        </>
                    )}

                    {/* Redirect unknown routes */}
                    <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} replace />} />
                </Routes>
            </div>

            {showFooter && <Footer />}
        </div>
    );
}

export default App;
