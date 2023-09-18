export default function Footer() {
    return (
        <div className="footer-holder" >
        <div className="footer">
            <div className="footer-link">Contributors:&nbsp;&nbsp;Cameron Beck,&nbsp;&nbsp;Brian Hitchin,&nbsp;&nbsp;Cynthia Liang,&nbsp;&nbsp;Dave Titus</div>
            <div className="footer-link">
                <span>
                    <a className="footer-button" href="https://github.com/cbkinase/Smack" target="_blank" rel="noreferrer">
                        <span>GitHub Repo</span>
                        <button className="footer-button"><i className="fa fa-github"
                            style={{ fontSize: '14px' }}></i></button>
                    </a>
                </span>
            </div>
        </div>
    </div >
    )
}
