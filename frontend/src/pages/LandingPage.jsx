import React from 'react';
import { Link } from 'react-router';

function LandingPage() {
    return ( 
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>PeerFlux</h2>
                </div>
                <div className='navlist'>
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <div role='button'>Login</div>
                </div>
            </nav>

            <div className="landingPageMainContainer">
                <div>
                    <h1><span style={{color: "#FF9839"}}>Connect</span> with your Loved Ones</h1>
                    <p>Cover a distance by video call</p>
                    <div role='button'>
                        <Link to={"/home"}>Get Started</Link>
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