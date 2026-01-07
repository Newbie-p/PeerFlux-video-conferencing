import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import server from '../environment';

function GuestJoin() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');

        // Validate inputs
        if (!meetingCode.trim()) {
            setError('Please enter a meeting code');
            return;
        }
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);

        try {
            // Check if meeting exists
            const response = await fetch(`${server}/api/v1/users/check-meeting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingCode: meetingCode.toUpperCase() })
            });

            const data = await response.json();

            if (data.exists) {
                // Store guest information in localStorage
                localStorage.setItem('guestName', name);
                localStorage.setItem('isGuest', 'true');

                // Redirect to the meeting room with the meeting code
                navigate(`/${meetingCode.toUpperCase()}`);
            } else {
                setError('Meeting does not exist. Please check the meeting code.');
            }
        } catch (err) {
            setError('Failed to verify meeting. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>PeerFlux</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => navigate('/')}>Back</p>
                </div>
            </nav>

            <div className="guestJoinContainer">
                <div className="guestJoinForm">
                    <h1>Join Meeting as Guest</h1>
                    <form onSubmit={handleJoin}>
                        <div className="formGroup">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                maxLength={50}
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="meetingCode">Meeting Code</label>
                            <input
                                type="text"
                                id="meetingCode"
                                placeholder="Enter meeting code"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                                disabled={loading}
                                maxLength={20}
                            />
                        </div>

                        {error && <div className="errorMessage">{error}</div>}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="joinButton"
                        >
                            {loading ? 'Joining...' : 'Join Meeting'}
                        </button>
                    </form>

                    <p className="loginPrompt">
                        Want to host a meeting? <span onClick={() => navigate('/auth')} style={{cursor: 'pointer', color: '#FF9839', fontWeight: 'bold'}}>Login here</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default GuestJoin;
