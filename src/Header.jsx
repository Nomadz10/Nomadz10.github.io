import React from "react";
import './assets/styles/navbar.css'; // Ensure correct CSS path
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Header = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the desired path
    };

    return (
        <header>
            <nav className="navbar-custom">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Logo or Brand */}
                    <span className="navbar-brand" onClick={() => handleNavigation("/")}>Vijay Muppalla</span>

                    {/* Navbar links */}
                    <ul className="navbar-nav d-flex">
                        <li className="nav-item">
                            <span className="nav-link" onClick={() => handleNavigation("/")}>Home</span>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" onClick={() => handleNavigation("/ConvolutionTool")}>Convolution Tool</span>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" onClick={() => handleNavigation("/SentAnal.jsx")}>Autonomous Delivery Robots</span>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;