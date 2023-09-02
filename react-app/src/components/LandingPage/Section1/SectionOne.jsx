import sidebar from '../../../assets/landing-1-smack-sidebar.png'
import chat from '../../../assets/landing-1-smack-chat.png'
import './SectionOne.css';

export default function SectionOne () {
    return (
        <div className="landing-1">
            <div className="landing-one-text slide-up">
                <div>Are you ready to talk some Smack?</div>
                <div>Talk about your coworkers, with your coworkers. Facilitate group smack rooms.</div>
                <a href='/login'>
                    <button className="login-input-submit">
                        Talk smack {` `}
                        <i className="fa-solid fa-angle-right"
                            style={{ fontSize: "1.2rem" }}
                        >
                        </i>
                    </button>
                </a>
                
            </div>
            <div className="landing-one-figures fade-in">
                <div id="landing-one-figure-1">
                    <img src={sidebar} alt="smack-figure-sidebar"></img>
                </div>
                <div id="landing-one-figure-2">
                    <img src={chat} alt="smack-figure-chat"></img>
                </div>
            </div>
        </div>

    )
}
