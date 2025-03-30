import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { login, signup } from './firebase';
import logo from './assets/logo.png';

const Login = () => {
    const [authMode, setAuthMode] = useState("login");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (authMode === "login") {
                await login(email, password);
                navigate('/'); // Redirect after successful login
            } else {
                await signup(name, email, password);
                navigate('/'); // Redirect after successful signup
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Clear error when switching between login/signup
    useEffect(() => {
        setError('');
    }, [authMode]);

    return (
        <div className='login-page'>
            <div className='auth-container'>
                <div className='logo'>
                    <img src={logo} alt='Eco Travel Logo'/>
                </div>
                
                <div className='auth-card'>
                    <div className='auth-tabs'>
                        <button 
                            className={`tab ${authMode === 'login' ? 'active' : ''}`}
                            onClick={() => setAuthMode('login')}
                        >
                            Sign In
                        </button>
                        <button 
                            className={`tab ${authMode === 'signup' ? 'active' : ''}`}
                            onClick={() => setAuthMode('signup')}
                        >
                            Create Account
                        </button>
                    </div>

                    <form onSubmit={handleAuth}>
                        {authMode === "signup" && (
                            <div className='input-group'>
                                <label htmlFor='name'>Full Name</label>
                                <input 
                                    type='text' 
                                    id='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder='Your Name' 
                                    required
                                />
                            </div>
                        )}

                        <div className='input-group'>
                            <label htmlFor='email'>Email Address</label>
                            <input 
                                type='email' 
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='your@email.com' 
                                required
                            />
                        </div>

                        <div className='input-group'>
                            <label htmlFor='password'>Password</label>
                            <input 
                                type='password' 
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='••••••••' 
                                minLength="6"
                                required
                            />
                            {authMode === "login" && (
                                <Link to="/forgot-password" className='forgot-password'>
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {error && <div className='error-message'>{error}</div>}

                        <button type='submit' disabled={loading} className='auth-button'>
                            {loading ? (
                                <span className='spinner'></span>
                            ) : (
                                authMode === "login" ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className='auth-footer'>
                        {authMode === "login" ? (
                            <p>
                                New to Eco Travel?{' '}
                                <button onClick={() => setAuthMode('signup')} className='switch-mode'>
                                    Create an account
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <button onClick={() => setAuthMode('login')} className='switch-mode'>
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>

                    <div className='auth-divider'>
                        <span>or continue with</span>
                    </div>

                    <div className='social-auth'>
                        <button className='google-auth'>
                            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
                            Google
                        </button>
                        {/* Add more social auth options if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;