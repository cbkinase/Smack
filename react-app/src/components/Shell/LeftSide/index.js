import React from "react";
import LeftSideHeader from "./LeftSideHeader";
import LeftSideLinks from "./LeftSideBar";

function LeftSide({ isLoaded }) {

    return (
        <>
            <LeftSideHeader />

            <LeftSideLinks />
        </>
    );
}

export default LeftSide;
