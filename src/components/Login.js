import React, { useState } from 'react';
import { loginUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'; // Import the CSS file
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Import icons

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await loginUser(email, password);
            alert('Logged in successfully!');
            navigate('/journal');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="unique-login-container">
            <div className="unique-login-box">
                
                <div className="unique-login-field">
                    <FaEnvelope className="unique-login-icon" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="unique-login-input"
                        placeholder="Email"
                    />
                </div>
                <div className="unique-login-field">
                    <FaLock className="unique-login-icon" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="unique-login-input"
                        placeholder="Password"
                    />
                </div>
                <button onClick={handleLogin} className="unique-login-button">LOGIN</button>
                {error && <p className="unique-login-error">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
