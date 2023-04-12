import React from 'react';

function Messages() {

    return (
        <>
            <div id="pinned-message-holder" className="pinned-message-holder" style={{ display: "none" }}>
                <button><i style={{paddingRight: "5px"}} class="far fa-dot-circle"></i> 2 Pinned</button>
            </div>
            {/* <!-- ======== Message Card ========= --> */}
            <div id="message-1" className="message-card">
                <div>

                </div>
                <div>
                    <img src="https://ca.slack-edge.com/T0266FRGM-UQ46QH94Z-gc24d346e359-512"
                        alt="Brian Hitchin" style={{ borderRadius: "5px", width: "36px", height: "36px" }}></img>
                </div>
                <div className="message-card-content">
                    <div className="message-card-header">
                        <div>
                            <span className="message-card-name" onclick="toggleRightPane('open');">Brian
                                Hitchin</span>
                            <span className="message-card-time">5:51 PM</span>
                        </div>
                        <div className="message-card-makechangebox">
                            <span id="message-adjust-text-1" className="message-adjust-text"></span>
                            <span onmouseover="changeAdjustText('Add Reaction', 1)"
                                onmouseout="changeAdjustText('', 1)" className="message-adjust-reaction">
                                <i className="far fa-smile"></i>
                            </span>
                            <span onmouseover="changeAdjustText('Pin Message', 1)"
                                onmouseout="changeAdjustText('', 1)" onclick="highlightMessage(1)"
                                className="message-adjust-pin">
                                <i className="far fa-dot-circle"></i>
                            </span>
                            <span onmouseover="changeAdjustText('Edit Message', 1)"
                                onmouseout="changeAdjustText('', 1)" className="message-adjust-edit">
                                <i className="far fa-edit"></i>
                            </span>
                            <span onmouseover="changeAdjustText('Delete Message', 1)"
                                onmouseout="changeAdjustText('', 1)" className="message-adjust-delete">
                                <i className="far fa-trash-alt"></i>
                            </span>
                        </div>
                    </div>
                    <div>
                        Case scriptorem in pro. Zril erroribus persecuti id nam, at pro nihil quodsi aliquam. Id
                        eum nonumy invenire, similique
                        reprimique sea et. Cu ceteros accusam mei, altera eruditi liberavisse usu in, accusamus
                        efficiendi eam ad. 😀
                    </div>
                    {/* <!-- ### IF NO REACTIONS DO NOT INCLUDE THIS "message-card-footer" DIV -->
                    <!-- <div className="message-card-footer">
                        <div className="message-card-reaction">
                            👍<span className="message-card-reaction-count">2</span>
                        </div>
                        <div className="message-card-reaction">
                            🤣<span className="message-card-reaction-count">1</span>
                        </div>
                    </div> --> */}
                </div>
            </div>
        </>
    );
}

export default Messages;