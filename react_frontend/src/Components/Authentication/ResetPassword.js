import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/main.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for submission
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if email or code verification is not completed
  useEffect(() => {
    const emailVerified = localStorage.getItem('emailVerified');
    const codeVerified = localStorage.getItem('codeVerified');
    
    if (!emailVerified || !codeVerified) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error for field on change
  };

  // Form validation
  const setCorrectly = () => {
    let newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!setCorrectly()) return;
    
    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        newPassword: formData.newPassword,
      });

      toast.success(response.data.message, {
        onClose: () => {
          localStorage.removeItem('emailVerified');
          localStorage.removeItem('codeVerified');
          navigate("/login");
        },
      });

    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed. Try again.";
      toast.error(message);
      console.error("Error occurred while resetting password:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after the request
    }
  };

  return (
    <div className="login-container">
      <ToastContainer autoClose={3000} />

      <button className="btn back-button" onClick={() => navigate("/verify-code", { state: { email } })}>
        <i className="bi bi-arrow-left-circle-fill"></i>
      </button>

      <div className="text-center">
        <h2 className="login-title">Reset Password</h2>
        <p className="instruction-text text-muted">
          Your new password must be at least <b>6 characters</b> long.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>



      





      <div className="mb-3 position-relative">
  <label className="form-label">New Password</label>
  <div className="input-group">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      name="newPassword"
      value={formData.newPassword}
      onChange={handleChange}
    />
    <span
      className="input-group-text"
      onClick={() => setShowPassword(!showPassword)}
    >
      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
    </span>
  </div>
  {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
</div>

<div className="mb-3 position-relative">
  <label className="form-label">Confirm New Password</label>
  <div className="input-group">
    <input
      type={showConfirmPassword ? "text" : "password"}
      className="form-control"
      name="confirmNewPassword"
      value={formData.confirmNewPassword}
      onChange={handleChange}
    />
    <span
      className="input-group-text"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
    </span>
  </div>
  {errors.confirmNewPassword && <p className="error-text">{errors.confirmNewPassword}</p>}
</div>

        <button type="submit" className="btn login-btn w-100" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
