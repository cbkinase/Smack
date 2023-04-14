import React from 'react';
import { useSelector } from 'react-redux';
import LeftSideHeader from './LeftSideHeader';
import LeftSideLinks from './LeftSideBar';

function LeftSide({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <>
            <LeftSideHeader />

            <LeftSideLinks />
        </>
    );
}

export default LeftSide;