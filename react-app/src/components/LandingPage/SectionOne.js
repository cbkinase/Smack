import sidebar from '../../assets/landing-1-smack-sidebar.png'
import chat from '../../assets/landing-1-smack-chat.png'

function SectionOne () {
    return (
        <div className="landing-1">
            <div className="landing-one-text">
                <div>Are you ready to talk some Smack?</div>
                <div>Talk about your coworkers, with your coworkers. Facilitate group smack rooms.</div>
                <button className="login-input-submit">
                    Talk smack {` `}
                    <i className="fa-solid fa-angle-right"
                        style={{fontSize: "1.2rem"}}
                    >
                    </i>
                </button>
            </div>
            <div className="landing-one-figures">
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

export default SectionOne