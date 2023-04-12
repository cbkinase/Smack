import React from 'react';

function MessageCard() {

    return (
        <>
            {/* <!-- ======== Message Card ========= --> */}
            <div id="message-2" className="message-card">
                <div>
                    <img src="https://ca.slack-edge.com/T03GU501J-U04B5SVB5N1-fe508f121b64-512"
                        alt="Brian Hitchin" style={{borderRadius: "5px", width:"36px", height:"36px"}}></img>
                </div>
                <div className="message-card-content">
                    <div className="message-card-header">
                        <div>
                            <span className="message-card-name" onclick="toggleRightPane('open');">Cameron
                                Beck</span>
                            <span className="message-card-time">5:51 PM</span>
                        </div>
                        <div className="message-card-makechangebox">
                            <span id="message-adjust-text-2" className="message-adjust-text"></span>
                            <span onmouseover="changeAdjustText('Add Reaction', 2)"
                                onmouseout="changeAdjustText('', 2)" className="message-adjust-reaction">
                                <i className="far fa-smile"></i>
                            </span>
                            <span onmouseover="changeAdjustText('Pin Message', 2)"
                                onmouseout="changeAdjustText('', 2)" onclick="highlightMessage(2)"
                                className="message-adjust-pin">
                                <i className="far fa-dot-circle"></i>
                            </span>
                        </div>
                    </div>
                    <div>
                        Case scriptorem in pro. Zril erroribus persecuti id nam, at pro nihil quodsi aliquam. Id
                        eum nonumy invenire, similique
                        reprimique sea et.
                    </div>
                    {/* <!-- ### IF NO REACTIONS DO NOT INCLUDE THIS "message-card-footer" DIV --> */}
                    <div className="message-card-footer">
                        <div className="message-card-reaction">
                            👍<span className="message-card-reaction-count">2</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessageCard;