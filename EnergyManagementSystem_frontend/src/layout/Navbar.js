import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <>
            <nav className="navbar-custom">
                <div className="navbar-content">
                    <Link to="/home" className="navbar-brand">
                        <img src="https://begreen.dk/wp-content/uploads/2024/02/BG_logo_Tag_neg.svg" alt="BeGreen" className="navbar-logo" />
                        <img src="https://cdn0.iconfinder.com/data/icons/internet-technology-6/512/smart_plug_electricity_power_wifi_network_wireless-512.png" alt="BeGreen" className="navbar-logo" />
                    </Link>
                    <div className="navbar-links">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                        <Link to="/userprofile" className="nav-link">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="User Profile" className="profile-icon" />
                        </Link>
                        <Link to="/chat-redirect" className="nav-link">
                            <img src="https://cdn-icons-png.flaticon.com/512/7174/7174950.png" alt="Chat" className="navbar-icon" />
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
