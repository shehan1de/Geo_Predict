import { useState } from "react";
import authService from "../../Components/Services/authService";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(email);
            alert("Verification code sent to your email!");
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit">Send Verification Code</button>
        </form>
    );
};

export default ForgotPassword;
