import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/main.css";

const AddUser = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
      valid = false;
    }

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

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
      valid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/users/user",
        { name, email, password, role },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        toast.success("User added successfully!", { position: "top-right", autoClose: 2000 });

        setTimeout(() => {
          navigate("/users"); // Redirect to user list
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <ToastContainer />

      <button className="btn back-button" onClick={() => navigate("/users", { state: { email } })}>
        <i className="bi bi-arrow-left-circle-fill"></i>
      </button>

      <h2 className="add-user-title">Add New User</h2>

      <form className="add-user-form" onSubmit={handleAddUser}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

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

        <div className="mb-3 position-relative">
          <label className="form-label">Confirm Password</label>
          <div className="input-group">
            <input type={showConfirmPassword ? "text" : "password"} className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <span className="input-group-text" onClick={toggleConfirmPasswordVisibility}>
              <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </span>
          </div>
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <div className="dropdown-wrapper">
            <select className="form-control dropdown" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Client">Client</option>
            </select>
            <span className="dropdown-icon">
              <i className="bi bi-caret-down-fill"></i>
            </span>
          </div>
        </div>

        <button type="submit" className="btn login-btn" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm"></span> : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
