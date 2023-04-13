import React from 'react';
import ChannelHeader from './Channels/ChannelHeader';
import Messages from './Messages/Messages';
import Editor from './Editor/Editor';
import OneChannel from '../../../store/channel';
import Chat from '../../ChatTest'



function Content({ isLoaded }) {

    return (
        <>
            <div id="grid-content-heading" className="grid-content-heading-threecolumn">
                <ChannelHeader />
            </div>
            <div id="grid-content" className="grid-content-threecolumn">
                {/* <Messages /> */}
                {/* <Chat /> */}
                <OneChannel />


            </div>
            <div id="grid-editor" className="grid-editor-threecolumn">
                <Editor />
            </div>
        </>
    );
}

export default Content;
