import cyn from '../../../assets/cyn.jpg';
import cam from '../../../assets/cam.jpeg';
import brian from '../../../assets/brian.jpeg';
import dave from '../../../assets/dave.png';
import github from '../../../assets/github-mark.png';
import './authors.css'

function Authors() {
    return (
        <div className="landing-authors">
            <a href="https://www.linkedin.com/in/cameron-beck-4a9a44274/"
                target="_blank" rel="noreferrer noopener"
            >
                <img src={cam} alt="contributer photo"></img>

            </a>

            <a href="https://www.linkedin.com/in/cynthia-liang-1ab860243/"
                target="_blank" rel="noreferrer noopener"
            >
                <img src={cyn} alt="contributer photo"></img>

            </a>
            <a href="https://github.com/cbkinase/Smack"
                target="_blank" rel="noreferrer noopener"
            >
                <img src={github} alt="contributer photo"></img>

            </a>
            <a href="https://www.linkedin.com/in/brian-hitchin-940b57268/"
                target="_blank" rel="noreferrer noopener"
            >
                <img src={brian} alt="contributer photo"></img>

            </a>
            <a href="https://www.linkedin.com/in/djtitus/"
                target="_blank" rel="noreferrer noopener"
            >
                <img src={dave} alt="contributer photo"></img>

            </a>

        </div>
    )
}

export default Authors;