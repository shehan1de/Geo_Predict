import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
      throw error;
    }
  },

  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error.message);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data || error.message);
      throw error;
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, data);
      return response.data;
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error.message);
      throw error;
    }
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  }
};

export default authService;
