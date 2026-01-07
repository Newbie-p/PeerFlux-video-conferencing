import React, { useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../App.css";

function Authentication() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [formState, setFormState] = useState(0); // 0 = login, 1 = register
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const { handleRegister, handleLogin } = useContext(AuthContext);

    const handleAuth = async () => {
        setMessage("");
        setSeverity("success");
        setLoading(true);

        try {
            if (formState == 0) {
                // Login
                if (!username.trim() || !password.trim()) {
                    setMessage("Please fill in all fields");
                    setSeverity("error");
                    setOpen(true);
                    setLoading(false);
                    return;
                }
                await handleLogin(username, password);
            }
            if (formState == 1) {
                // Register
                if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
                    setMessage("Please fill in all fields");
                    setSeverity("error");
                    setOpen(true);
                    setLoading(false);
                    return;
                }
                let result = await handleRegister(name, email, username, password);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setFormState(0);
                setPassword("");
                setName("");
                setEmail("");
            }
        } catch (error) {
            let errorMessage = "An unknown error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Something went wrong!";
            } else {
                errorMessage = "Network error, please try again later!";
            }
            setMessage(errorMessage);
            setSeverity("error");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPageContainer">
            <nav className="authNav">
                <div className="navHeader">
                    <h2 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>PeerFlux</h2>
                </div>
                <div className="navBackButton">
                    <p onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Back to Home</p>
                </div>
            </nav>

            <div className="authMainContainer">
                <div className="authLeftPanel">
                    <div className="authLeftContent">
                        <h1>Welcome to PeerFlux</h1>
                        <p>Connect instantly with video calls. No downloads needed.</p>
                        <div className="authFeatures">
                            <div className="feature">
                                <span className="featureIcon">📹</span>
                                <div>
                                    <h3>HD Video</h3>
                                    <p>Crystal clear video calls</p>
                                </div>
                            </div>
                            <div className="feature">
                                <span className="featureIcon">🔐</span>
                                <div>
                                    <h3>Secure</h3>
                                    <p>End-to-end encrypted</p>
                                </div>
                            </div>
                            <div className="feature">
                                <span className="featureIcon">⚡</span>
                                <div>
                                    <h3>Fast</h3>
                                    <p>Low latency connection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="authRightPanel">
                    <div className="authFormContainer">
                        <div className="authFormHeader">
                            <h2>PeerFlux</h2>
                            <p>{formState === 0 ? "Sign in to your account" : "Create a new account"}</p>
                        </div>

                        <div className="authTabButtons">
                            <button
                                className={`authTab ${formState === 0 ? 'active' : ''}`}
                                onClick={() => {
                                    setFormState(0);
                                    setMessage("");
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                className={`authTab ${formState === 1 ? 'active' : ''}`}
                                onClick={() => {
                                    setFormState(1);
                                    setMessage("");
                                }}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form className="authForm" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                            {formState === 1 && (
                                <div className="formGroup">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            {formState === 1 && (
                                <div className="formGroup">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            <div className="formGroup">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="formGroup">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {formState === 0 && (
                                <div className="rememberMe">
                                    <input type="checkbox" id="remember" />
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="authSubmitBtn"
                                disabled={loading}
                                onClick={handleAuth}
                            >
                                {loading ? (
                                    <span>{formState === 0 ? "Signing in..." : "Creating account..."}</span>
                                ) : (
                                    <span>{formState === 0 ? "Sign In" : "Sign Up"}</span>
                                )}
                            </button>
                        </form>

                        <div className="authFooter">
                            {formState === 0 ? (
                                <p>Don't have an account? <span onClick={() => setFormState(1)} style={{ color: '#FF9839', fontWeight: 'bold', cursor: 'pointer' }}>Sign up</span></p>
                            ) : (
                                <p>Already have an account? <span onClick={() => setFormState(0)} style={{ color: '#FF9839', fontWeight: 'bold', cursor: 'pointer' }}>Sign in</span></p>
                            )}
                        </div>

                        <div className="orDivider">
                            <span>or continue as guest</span>
                        </div>

                        <button
                            className="guestLoginBtn"
                            onClick={() => navigate('/guest-join')}
                        >
                            Join as Guest
                        </button>
                    </div>
                </div>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Authentication;