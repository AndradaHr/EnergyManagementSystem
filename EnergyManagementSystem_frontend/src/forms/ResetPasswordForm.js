import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordForm() {
    const [inputs, setInputs] = useState({
        verificationCode: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { verificationCode, newPassword } = inputs;

    const handleChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:8080/auth/reset', {
                token: verificationCode,
                password: newPassword
            });
            alert('Your password has been reset successfully.');
            navigate('/login');
        } catch (error) {
            console.error('Error during password reset:', error);
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2>Reset Your Password</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="verificationCode">Verification Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="verificationCode"
                                name="verificationCode"
                                value={verificationCode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
