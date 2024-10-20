import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import './assets/styles/navbar.css'; // Ensure correct CSS path

const Header = () => {
    const navigate = useNavigate(); // Initialize the navigation hook

    return (
        <header>
            <nav className="navbar-custom">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Logo or Brand */}
                    <button className="navbar-brand" onClick={() => navigate("/")}>
                        Vijay Muppalla
                    </button>

                    {/* Navbar links */}
                    <ul className="navbar-nav d-flex">
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigate("/")}>
                                Home
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigate("/ConvolutionTool")}>
                                Convolution Tool
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigate("/SentAnal.jsx")}>
                                Autonomous Delivery Robots
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
