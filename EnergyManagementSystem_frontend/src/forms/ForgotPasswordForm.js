import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Construiește URL-ul cu parametrul de query pentru email
            const url = `http://localhost:8080/auth/forgot?email=${encodeURIComponent(email)}`;
            await axios.post(url);
            // Utilizatorul este notificat să verifice emailul pentru link-ul de resetare a parolei
            alert('Please check your email for the password reset link.');
            // Redirecționarea opțională către pagina de login
            navigate('/reset-password');
        } catch (error) {
            console.error('Error during forgot password request:', error);
            setError('Failed to send reset password email. Please try again.');
        }
    };

    return (
        <div className="forgot-password-form">
            <h2>Reset Your Password</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Reset Link</button>
            </form>
        </div>
    );
}
