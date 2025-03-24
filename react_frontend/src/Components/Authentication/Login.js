import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/main.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
      valid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id);

        toast.success("Login Successful!", { position: "top-right", autoClose: 2000 });

        setTimeout(() => {
          navigate(data.user.role === "Admin" ? "/users" : "/predict");
        }, 2000);
      }
    } catch (error) {
      toast.error(` ${error.response?.data?.message || "Login failed. Try again."}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary spinner-border-lg"></div>
        </div>
      ) : (
        <>
          <h2 className="login-title">GeoPredict Sign in</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className="input-group-text" onClick={togglePasswordVisibility}>
                  <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </span>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="fp">
              <a href="/forgot-password" className="text-danger">Forgot Password?</a>
            </div>

            <button type="submit" className="btn login-btn" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Login"}
            </button>
          </form>

          <div className="auth-links">
            <span>Do you not have an account? </span>
            <a href="/register" className="text-primary">Sign Up</a>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
