import React from 'react';


function RightSideHeader() {

    return (
        <div id="grid-rightside-heading" className="grid-rightside-heading-hide">
            <div className="rightside-heading-holder">
                <div>Profile</div>
                <div>
                    <button className="rightside-close-btn" onclick="toggleRightPane('close');toggleLeftPane();">
                        <i className="fa-solid fa-x"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RightSideHeader;