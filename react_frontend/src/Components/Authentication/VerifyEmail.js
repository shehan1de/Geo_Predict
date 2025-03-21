import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/main.css";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(180);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    const emailVerified = localStorage.getItem('emailVerified');
    if (!emailVerified) {
      // If email is not verified, redirect to the email entry page
      navigate("/forgot-password");
    }
  
    document.getElementById("codeInput")?.focus();
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          localStorage.removeItem("expirationTime");
          navigate("/verify-reset-code");
        }
        return prevTimer - 1;
      });
    }, 1000);
  
    return () => clearInterval(countdown);
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Verification code is required");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await axios.post("/api/auth/verify-reset-code", { email, code });
  
      localStorage.setItem('codeVerified', 'true');
  
      toast.success(response.data.message, {
        onClose: () => navigate("/reset-password", { state: { email } }),
      });
  
    } catch (error) {
      setError(error.response?.data?.message || "Invalid code. Try again.");
      toast.error(error.response?.data?.message || "Invalid code. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timerColorClass = timer <= 120 ? "text-danger" : "text-muted";

  return (
    <div className="login-container">
      <ToastContainer autoClose={3000} />

      <button className="btn back-button" onClick={() => navigate("/forgot-password")}>
        <i className="bi bi-arrow-left-circle-fill"></i>
      </button>

      <div className="text-center">
        <h2 className="login-title">Verify Code</h2>
        <p className="instruction-text text-muted">
          Enter the verification code sent to <b>{email}</b>. Check your spam folder if you don't see it.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            id="codeInput"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            disabled={isSubmitting}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <button type="submit" className="btn login-btn w-100" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        {/* Timer Display */}
        <div className="mt-3">
          <p className={`${timerColorClass}`}>
            Time remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </p>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmail;
