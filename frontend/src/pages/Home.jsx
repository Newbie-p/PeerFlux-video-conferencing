import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { AuthContext } from '../contexts/AuthContext';
import server from '../environment';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const {addToUserHistory} = useContext(AuthContext);
    
    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            setError('Please enter a meeting code');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // Verify meeting exists before joining
            const response = await fetch(`${server}/api/v1/users/check-meeting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingCode: meetingCode.toUpperCase() })
            });

            const data = await response.json();

            if (data.exists) {
                // Meeting exists, add to history and join
                await addToUserHistory(meetingCode.toUpperCase());
                navigate(`/${meetingCode.toUpperCase()}`);
            } else {
                setError('Meeting does not exist. Please check the meeting code.');
            }
        } catch (err) {
            console.error('Join meeting error:', err);
            setError('Failed to join meeting. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    let handleCreateMeeting = async () => {
        const meetingCode = Math.random().toString(36).substring(2, 9).toUpperCase();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to create a meeting');
                setLoading(false);
                return;
            }
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        } catch (err) {
            console.error('Create meeting error:', err);
            setError('Failed to create meeting. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='landingPageContainer' style={{position: 'relative'}}>
            {/* Navigation */}
            <nav style={{
                padding: '1.6rem 1.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{fontSize: '1.8rem', fontWeight: '500', margin: '0', color: 'white'}}>
                    PeerFlux
                </h2>

                <div style={{display: 'flex', gap: '1.6rem', cursor: 'pointer', alignItems: 'center'}}>
                    <p 
                        style={{
                            margin: '0',
                            color: 'white',
                            fontSize: '1rem',
                            transition: 'color 0.3s'
                        }}
                        onClick={() => navigate("/history")}
                        onMouseEnter={(e) => e.target.style.color = '#FF9839'}
                        onMouseLeave={(e) => e.target.style.color = 'white'}
                    >
                        History
                    </p>
                    <div 
                        style={{
                            backgroundColor: '#D97500',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                        }}
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("username");
                            navigate("/auth");
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF9839'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D97500'}
                    >
                        <p style={{margin: '0', color: 'white', fontSize: '1rem'}}>Logout</p>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingInline: '3rem',
                minHeight: '80vh',
                gap: '2rem'
            }}>
                {/* Main Card Container */}
                <div style={{
                    maxWidth: '700px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        color: 'white',
                        marginTop: '0',
                        marginBottom: '0.8rem',
                        fontWeight: '700',
                        textAlign: 'center'
                    }}>
                        Ready for a <span style={{color: '#FF9839'}}>Video Call?</span>
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '2.5rem',
                        lineHeight: '1.6',
                        textAlign: 'center'
                    }}>
                        Connect with others instantly. Create a new meeting or join an existing one.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(211, 47, 47, 0.3)',
                            border: '1px solid #FF6B6B',
                            color: '#FFB3B3',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            fontSize: '0.95rem',
                            textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Create Meeting Section */}
                    <div style={{marginBottom: '2.2rem'}}>
                        <label style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '1rem',
                            display: 'block',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: '600'
                        }}>
                            ➕ Create New Meeting
                        </label>
                        <button
                            onClick={handleCreateMeeting}
                            disabled={loading}
                            style={{
                                backgroundColor: '#FF9839',
                                color: 'white',
                                border: 'none',
                                padding: '1.2rem 2.5rem',
                                fontSize: '1.05rem',
                                borderRadius: '14px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                width: '100%',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                opacity: loading ? 0.7 : 1,
                                boxShadow: '0 4px 15px rgba(255, 152, 57, 0.3)',
                                transform: 'translateY(0)'
                            }}
                            onMouseEnter={(e) => !loading && (e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 152, 57, 0.5)', e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => !loading && (e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 152, 57, 0.3)', e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            {loading ? '⏳ Creating...' : 'Create Meeting'}
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        margin: '2.5rem 0',
                        opacity: 0.5
                    }}>
                        <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)'}}></div>
                        <span style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem'}}>OR</span>
                        <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)'}}></div>
                    </div>

                    {/* Join Meeting Section */}
                    <div>
                        <label style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '1rem',
                            display: 'block',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: '600'
                        }}>
                            📲 Join Existing Meeting
                        </label>
                        <div style={{
                            display: 'flex',
                            gap: '0.8rem',
                            alignItems: 'stretch'
                        }}>
                            <input
                                type="text"
                                placeholder="Enter meeting code"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                                disabled={loading}
                                style={{
                                    padding: '1rem 1.2rem',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    fontSize: '1rem',
                                    flex: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'text',
                                    transition: 'all 0.3s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => !loading && (e.currentTarget.style.borderColor = '#FF9839', e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                                onBlur={(e) => !loading && (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)', e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
                            />
                            <button
                                onClick={handleJoinVideoCall}
                                disabled={loading}
                                style={{
                                    backgroundColor: '#D97500',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    borderRadius: '10px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    opacity: loading ? 0.7 : 1,
                                    boxShadow: '0 4px 12px rgba(217, 117, 0, 0.3)',
                                    transform: 'translateY(0)',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#FF9839', e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 152, 57, 0.4)', e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#D97500', e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 117, 0, 0.3)', e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                {loading ? '⏳' : '✓'} {loading ? 'Joining...' : 'Join'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Info */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    maxWidth: '700px',
                    marginTop: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{textAlign: 'center', flex: '1', minWidth: '120px'}}>
                        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎥</div>
                        <p style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0'}}>HD Video</p>
                    </div>
                    <div style={{textAlign: 'center', flex: '1', minWidth: '120px'}}>
                        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💬</div>
                        <p style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0'}}>Instant Chat</p>
                    </div>
                    <div style={{textAlign: 'center', flex: '1', minWidth: '120px'}}>
                        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔒</div>
                        <p style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0'}}>Secure</p>
                    </div>
                    <div style={{textAlign: 'center', flex: '1', minWidth: '120px'}}>
                        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚡</div>
                        <p style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0'}}>Fast Setup</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default withAuth(HomeComponent)