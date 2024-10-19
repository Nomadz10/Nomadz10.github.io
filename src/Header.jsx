import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import './assets/styles/navbar.css'; // Ensure correct CSS path

const Header = () => {
    return (
        <header>
            <nav className="navbar-custom">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Logo or Brand */}
                    <Link className="navbar-brand" to="/">Vijay Muppalla</Link>

                    {/* Navbar links */}
                    <ul className="navbar-nav d-flex">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/ConvolutionTool">Convolution Tool</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/SentAnal.jsx">Autonomous Delivery Robots</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
