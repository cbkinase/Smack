import smackLogo from '../../Shell/LeftSide/smack-logo-white.svg';
import './Nav.css';

function Nav () {
    return (
        <nav className="landing-nav">
            <div className="landing-nav-content">
                    <img src={smackLogo} alt="smack logo"></img>
                    <a href='/login'>Log In</a>

            </div>
        </nav>
    )
}

export default Nav;