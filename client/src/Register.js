import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newsletter, setnewsletter] = useState('No')

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, newsletter }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Registration successful! You are now registered.');
            console.log('Success:', data);
            navigate('/');
        })
        .catch(error => {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        });
    };


    return (
        
        <div className="register-container">
                            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
            <h3 className='lbl'>Username</h3>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="register-input" // Add this line if you have styles for input
                />
                <h3>Email</h3>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="register-input" // Add this line if you have styles for input
                />
                <h3>Password</h3>

                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="register-input" // Add this line if you have styles for input
                />
                <label className="register-label">
                    Sign up for newsletters?
                    <input
                        type='checkbox'
                        checked = {newsletter === 'Yes'}
                        onChange = {(e) => setnewsletter(e.target.checked ? 'Yes' : 'No')}
                    />
                </label>
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};

export default Register;