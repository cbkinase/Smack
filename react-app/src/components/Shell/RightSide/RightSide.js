import React from 'react';
import RightSideHeader from './RightSideHeader';
import RightSideInfo from './RightSideInfo';

function RightSide({selectedUserRightBar, setSelectedUserRightBar}) {

    return (
        <>
            <RightSideHeader />
            <RightSideInfo selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={selectedUserRightBar}  />
        </>
    );
}

export default RightSide;
