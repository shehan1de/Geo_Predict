import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-4 mt-auto">
            <div className="container text-center">
                <p>&copy; {new Date().getFullYear()} GeoPredict. All Rights Reserved.</p>
                <p>
                    <Link to="/terms" className="text-white text-decoration-none mx-2">Terms of Service</Link> |
                    <Link to="/privacy" className="text-white text-decoration-none mx-2">Privacy Policy</Link> |
                    <Link to="/contact" className="text-white text-decoration-none mx-2">Contact Us</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
