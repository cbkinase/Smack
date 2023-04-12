import React from 'react';

function ChannelHeader() {

    return (

            <div class="content-heading-holder">
                <div class="content-header-left">
                    <button class="content-header-channelname"> 
                        # Team Group 3
                        <i style={{fontSize: "12px", marginLeft: "3px"}} class="fas fa-angle-down"></i>
                    </button>
                    <div class="content-header-channeltopic">
                        This channel's topic goes right here.
                    </div>
                </div>

                <div class="content-header-right">
                    <button class="content-header-membercount">
                        <img style={{zIndex: 5}} class="membercount-image"
                            src="https://ca.slack-edge.com/T0266FRGM-UQ46QH94Z-gc24d346e359-512"
                            alt="Member"></img>
                        <img style={{zIndex: 4, position: "relative", left: "-8px"}} class="membercount-image"
                            src="https://ca.slack-edge.com/T03GU501J-U04B5SVB5N1-fe508f121b64-512"
                            alt="Member"></img>
                        <img style={{zIndex: 3, position: "relative", left: "-16px"}} class="membercount-image"
                            src="https://ca.slack-edge.com/T03GU501J-U04A1FE78LF-38f81f9f415d-512"
                            alt="Member"></img>
                        <span style={{zIndex: 4, position: "relative", left: "-8px"}}>8</span>
                    </button>
                </div>
            </div>
            
    );
}

export default ChannelHeader;