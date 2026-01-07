import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history || []);
            } catch (error) {
                console.error('Error fetching history:', error);
                setMeetings([]);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className='landingPageContainer' style={{ minHeight: '100vh' }}>
            {/* Navigation Header */}
            <nav style={{
                padding: '1.6rem 1.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '500', margin: '0', color: 'white' }}>
                    Meeting History
                </h2>
                <button
                    onClick={() => navigate("/home")}
                    style={{
                        backgroundColor: '#D97500',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FF9839', e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 152, 57, 0.4)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D97500', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
                >
                    ← Back to Home
                </button>
            </nav>

            {/* Main Content */}
            <div style={{ padding: '3rem 2rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {loading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px'
                        }}>
                            <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                ⏳ Loading your meeting history...
                            </p>
                        </div>
                    ) : meetings.length > 0 ? (
                        <div>
                            <h3 style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '1.2rem',
                                marginBottom: '2rem',
                                fontWeight: '500'
                            }}>
                                📅 You have {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} in your history
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {meetings.map((meeting, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            transform: 'translateY(0)',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                                            e.currentTarget.style.border = '1px solid rgba(255, 152, 57, 0.3)';
                                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 152, 57, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                                        }}
                                        onClick={() => navigate(`/${meeting.meetingCode}`)}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <span style={{ fontSize: '1.8rem' }}>🎥</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Meeting Code
                                                </p>
                                                <p style={{
                                                    margin: '0',
                                                    fontSize: '1.4rem',
                                                    fontWeight: '700',
                                                    color: '#FF9839',
                                                    fontFamily: 'monospace',
                                                    letterSpacing: '2px'
                                                }}>
                                                    {meeting.meetingCode}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            <span style={{ fontSize: '1.2rem' }}>📅</span>
                                            <div>
                                                <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Date
                                                </p>
                                                <p style={{ margin: '0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', fontWeight: '500' }}>
                                                    {formatDate(meeting.date)}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            style={{
                                                width: '100%',
                                                marginTop: '1rem',
                                                padding: '0.8rem',
                                                backgroundColor: '#D97500',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 12px rgba(217, 117, 0, 0.3)'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/${meeting.meetingCode}`);
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#FF9839';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 152, 57, 0.4)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#D97500';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 117, 0, 0.3)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            Join Meeting →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <h3 style={{ fontSize: '1.3rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                                No meetings yet
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem' }}>
                                Create or join your first meeting to see it here
                            </p>
                            <button
                                onClick={() => navigate("/home")}
                                style={{
                                    backgroundColor: '#FF9839',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(255, 152, 57, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 152, 57, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 152, 57, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Go to Home →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}