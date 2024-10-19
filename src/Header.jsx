import React from "react";
import './assets/styles/navbar.css'; // Ensure correct CSS path

const Header = () => {
    return (
        <header>
            <nav className="navbar-custom">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Logo or Brand */}
                    <a className="navbar-brand" href="/">Vijay Muppalla</a>

                    {/* Navbar links */}
                    <ul className="navbar-nav d-flex">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/ConvolutionTool">Convolution Tool</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/SentAnal.jsx">Autonomous Delivery Robots</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
