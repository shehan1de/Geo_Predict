import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/main.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);
  
    if (!email.trim()) {
      setErrors("Email is required");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("/api/auth/request-reset", { email });
      
      localStorage.setItem('emailVerified', 'true');
      
      toast.success(response.data.message, {
        onClose: () => navigate("/verify-code", { state: { email } }),
      });
  
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer autoClose={3000} />

      {/* Back Button (Top Left Corner) */}
      <button className="btn back-button" onClick={() => navigate("/login")}>
        <i className="bi bi-arrow-left-circle-fill"></i>
      </button>

      {/* Forgot Password Section */}
      <div className="text-center">
        <h2 className="login-title">Forgot Password</h2>
        <p className="instruction-text text-muted">
          Enter your email, and we will send you a verification code.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className={`form-control ${errors ? "is-invalid" : ""}`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors && <div className="invalid-feedback">{errors}</div>}
        </div>
        <button type="submit" className="btn login-btn w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Sending...
            </>
          ) : (
            "Send Code"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
