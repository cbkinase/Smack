export default function LeftSidebarAboutMe() {
    return (
        <div style={{ position: 'absolute', bottom: '0px' }}>
        <div className="footer" style={{ padding: '20px', justifyContent: 'flex-start', alignItems: "flex-start", backgroundColor: '#3f0e40', width: "294px" }}>

            <div style={{borderTop: "1px solid #4e3752", width: "294px", marginLeft: "-20px"}}></div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px', textAlign: 'left' }}>

                <div>
                    <span style={{ color: '#969696' }}>Cameron Beck:</span>
                </div>

                <div className="footer-link">
                    <span>
                        <a className="footer-button" href="https://cbkinase.github.io/" target="_blank" rel="noreferrer">
                            <button className="copyright-button2">
                                <i className="fas fa-eye" style={{ fontSize: '14px' }}></i>
                            </button>
                        </a>
                    </span>
                </div>

                <div className="footer-link">
                    <span>
                        <a className="footer-button" href="https://github.com/cbkinase/Smack" target="_blank" rel="noreferrer">
                            <button className="copyright-button2">
                                <i className="fa fa-github" style={{ fontSize: '14px' }}></i>
                            </button>
                        </a>
                    </span>
                </div>

                <div className="footer-link">
                    <span>
                        <a className="footer-button" href="https://www.linkedin.com/in/cameron-beck-4a9a44274/" target="_blank" rel="noreferrer">
                            <button className="copyright-button2">
                                <i className="fa fa-linkedin-square" style={{ fontSize: '14px' }}></i>
                            </button>
                        </a>
                    </span>
                </div>
            </div >

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px', textAlign: 'left' }}>

                <div>
                    <span style={{ color: '#969696' }}>Cynthia Liang:</span>
                </div>

                <div className="footer-link">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>


                <div className="footer-link">
                    <span>
                        <a className="footer-button" href="https://github.com/cbkinase/Smack" target="_blank" rel="noreferrer">
                            <button className="copyright-button2">
                                <i className="fa fa-github" style={{ fontSize: '14px' }}></i>
                            </button>
                        </a>
                    </span>
                </div>

                <div className="footer-link">
                    <span>
                        <a className="footer-button" href="https://www.linkedin.com/in/cynthia-liang-1ab860243/" target="_blank" rel="noreferrer">
                            <button className="copyright-button2">
                                <i className="fa fa-linkedin-square" style={{ fontSize: '14px' }}></i>
                            </button>
                        </a>
                    </span>
                </div>
            </div >

            <div style={{borderBottom: "1px solid #4e3752", width: "294px", marginLeft: "-20px", height: "8px"}}></div>

            <div className="footer-link" style={{ fontSize: '11px', marginTop: "5px" }}>Additional Contributors:<br />Dave Titus,&nbsp;&nbsp;Brian Hitchin</div>
        </div >
    </div>
    )
}
