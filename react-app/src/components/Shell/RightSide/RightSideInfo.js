import React from 'react';


function RightSideInfo() {

    return (
        <div id="grid-rightside" className="grid-rightside-hide">
            <div className="rightside-holder">


                <div className="profile-avatar" style={{ margin: "20px 20px 10px 20px" }}>
                    <img src="https://ca.slack-edge.com/T03GU501J-U04B5SVB5N1-fe508f121b64-512"
                        alt="Cameron Beck"
                        style={{ borderRadius: "12px", maxWidth: "100%", maxHeight: "100%", minWidth: "180px" }}></img>
                </div>
                <div
                    style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", textAlign: "left", width: "100%" }}>
                    Cameron Beck
                </div>
                <div>
                    Eam no habemus conclusionemque, brute movet ne pri, ne est homero tempor invidunt. Case
                    scriptorem
                    in pro. Zril
                    erroribus persecuti id nam, at pro nihil quodsi aliquam. Id eum nonumy invenire,
                    similique.

                    <div style={{ marginTop: "20px" }}>
                        <button
                            style={{ fontSize: "15px", fontWeight: "500", backgroundColor: "#FFFFFF", padding: "5px 8px", borderRadius: "5px", border: "1px solid grey" }}>
                            <i style={{ paddingRight: '5px' }} className="far fa-comment"></i>Message
                        </button>
                    </div>





                </div>
            </div>
        </div>

    );
}

export default RightSideInfo;
