import sidebar from '../../../assets/landing-1-smack-sidebar.png'
import chat from '../../../assets/landing-1-smack-chat.png'
import './SectionOne.css';
import { NavLink } from "react-router-dom";
import smackFig1 from "../../../assets/Smack-layered-prev.svg";

export default function SectionOne () {
    return (
        <div className="landing-1">
            <div className="landing-one-text slide-up">
                <div>Are you ready to talk some Smack?</div>
                <div>Talk about your coworkers, with your coworkers. Facilitate group smack rooms.</div>
                <NavLink to='/login'>
                    <button className="login-input-submit">
                        Talk smack {` `}
                        <i className="fa-solid fa-angle-right"
                            style={{ fontSize: "1.2rem" }}
                        >
                        </i>
                    </button>
                </NavLink>
            </div>
            <div className="landing-one-figures fade-in">
                <img id="smack-figure-1"
                    src={smackFig1} 
                    alt="smack-figure-preview"
                >
                </img>
            </div>
        </div>

    )
}
