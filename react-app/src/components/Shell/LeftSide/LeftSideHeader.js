import React from 'react';
import logo from './smack-logo-white.svg'

function LeftSideHeader({ isLoaded }) {

    return (
            <div id="grid-leftside-heading" className="grid-leftside-heading-threecolumn">
                <div classNameName="leftside-heading-holder">
                    <img src={`${logo}`} alt="Smack" style={{ width: "127px" }}></img>
                </div>
            </div>

           
    );
}

export default LeftSideHeader;