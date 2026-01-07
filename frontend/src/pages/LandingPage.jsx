import React from 'react';
import { Link, useNavigate } from 'react-router';
import "../App.css"

function LandingPage() {
    const router = useNavigate();
    return ( 
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>PeerFlux</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => {
                        router("/guest-join")
                    }}>Join as Guest</p>
                    <p onClick={() => {
                        router("/auth")

                    }}>Register</p>
                    <div onClick={() => {
                        router("/auth")

                    }} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingPageMainContainer">
                <div>
                    <h1><span style={{color: "#FF9839"}}>Connect</span> with your Loved Ones</h1>
                    <p>Cover a distance by video call</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>
                    <img src='/mobile.png' alt='main image'/>
                </div>
            </div>
        </div>
     );
}

export default LandingPage;