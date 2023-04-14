import React from 'react';


function RightSideHeader() {

    const hideRightPane = function toggleRightPane() {
        document.getElementById("grid-container").className = "grid-container-hiderightside";
        document.getElementById("grid-rightside-heading").className = "grid-rightside-heading-hide";
        document.getElementById("grid-rightside").className = "grid-rightside-hide";
        window.toggleLeftPane();
    };

    return (
        <div id="grid-rightside-heading" className="grid-rightside-heading-hide">
            <div className="rightside-heading-holder">
                <div>Profile</div>
                <div>
                    <button className="rightside-close-btn" onClick={() => { hideRightPane() }}>
                        <i className="fa-solid fa-x"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RightSideHeader;
