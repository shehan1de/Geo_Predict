import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import "../css/main.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUser({
          token: data.token,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
  
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
  
        // First notification: Login successful
        toast.success("Login Successful!");
  
        // Second notification: Redirecting message
        setTimeout(() => {
          toast("Redirecting to your dashboard...", { icon: "🔄" });
  
          navigate(data.user.role === "Admin" ? "/dashboard" : "/predict");
        }, 1500); // Slight delay before showing the second message
      } else {
        toast.error(data.message || "Login failed. Try again.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-right" />
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 position-relative">
          <label className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="input-group-text" onClick={togglePasswordVisibility}>
              <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </span>
          </div>
        </div>
        <div className="fp">
        <a href="/forgot-password" className="text-danger">Forgot Password?</a>
        </div>
        
        <button type="submit" className="btn login-btn">Login</button>
      </form>
      
      <div className="auth-links">
        <span>Do you not have an account? </span>
        <a href="/register" className="text-primary">Sign Up</a>
        <br />
        
      </div>
    </div>
  );
};

export default Login;
