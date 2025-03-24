import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../image/logo.png";

const Navbar = ({ onLogout }) => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogout = () => {
        toast.success("Logged out successfully!", {
            position: "top-center",
            autoClose: 2000,
        });

        setTimeout(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            if (onLogout) onLogout();
            navigate("/login");
        }, 2000);
    };

    return (
        <>
            <ToastContainer />
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-2">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <img 
                            src={logo} 
                            alt="GeoPredict Logo" 
                            height="40" 
                            className="me-2"
                            style={{ maxHeight: "50px", objectFit: "contain" }} 
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {!user ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/about">About</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {role === "Admin" ? (
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/users">Users</Link>
                                        </li>
                                    ) : (
                                        <>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/predict">Prediction</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/compare">Compare</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/prediction-history">Prediction History</Link>
                                            </li>
                                        </>
                                    )}
                                    
                                    <li className="nav-item">
                                        <button 
                                            className="btn btn-danger ms-3 rounded-pill px-3" 
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
