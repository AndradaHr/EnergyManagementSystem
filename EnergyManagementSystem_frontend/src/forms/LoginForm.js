import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Buttons.css"; 

export default function LoginForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState(""); 

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setError(""); 
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://user.localhost/auth/login", user);
            if (response.status === 200) {
                const { jwt } = response.data;
                localStorage.setItem("token", jwt);
                
                const roleResponse = await axios.get(`http://user.localhost/user/role/${user.username}`);
                const role = roleResponse.data;
            
                localStorage.setItem("userRole", role);
                console.log("User role:", role);
            
                if (role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            }
            
        } catch (error) {
            setError("An error occurred. Please try again later.");
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Login Form</h2>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">Username</label>
                            <input type="text" className="form-control" name="username" value={user.username} onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" value={user.password} onChange={onInputChange} />
                        </div>
                        <button type="submit" className="btn custom-btn">Login</button>
                        <Link className="btn custom-btn" to="/register">Register</Link>
                    </form>
                    <div className="mt-3"> 
                        <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
