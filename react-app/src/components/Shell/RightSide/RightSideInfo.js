import React from 'react';


function RightSideInfo({ selectedUserRightBar, setSelectedUserRightBar }) {
    // console.log(selectedUserRightBar);
    // const {avatar, first_name, last_name, bio } = selectedUserRightBar.

    return (
        <div id="grid-rightside" className="grid-rightside-hide">
            <div className="rightside-holder">


                <div className="profile-avatar" style={{ margin: "20px 20px 10px 20px" }}>
                    <img src={selectedUserRightBar?.avatar}
                        alt={`${selectedUserRightBar?.first_name} ${selectedUserRightBar?.last_name}`}
                        style={{ borderRadius: "12px", maxWidth: "100%", maxHeight: "100%", minWidth: "180px" }}></img>
                </div>
                <div
                    style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", textAlign: "left", width: "100%" }}>
                    {selectedUserRightBar?.first_name} {selectedUserRightBar?.last_name}
                </div>
                <div style={{ textAlign: "left", width: "100%" }}>
                    {selectedUserRightBar?.bio}

                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={e => alert("Direct Message Feature Coming Soon")}
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
