import { useState } from "react";
import authService from "../Services/authService";

const ResetPassword = () => {
    const [data, setData] = useState({ code: "", newPassword: "" });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.resetPassword(data);
            alert("Password reset successfully! Please log in.");
        } catch (error) {
            alert("Invalid verification code or error in resetting password");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="code" placeholder="Enter verification code" onChange={handleChange} required />
            <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ResetPassword;
