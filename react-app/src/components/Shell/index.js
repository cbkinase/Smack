import React from 'react';
import { useSelector } from "react-redux";
import Header from './Header';
import LeftSide from './LeftSide'
import Content from './Content';
import RightSide from './RightSide/RightSide';

function Shell({ isLoaded }) {

    return (
        <div id="grid-container" className="grid-container-hiderightside">

            <Header isLoaded={isLoaded} />
            <LeftSide />
            <Content />
            <RightSide />

        </div>

    );
}

export default Shell;
