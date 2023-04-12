import React from 'react';
import Messages from './Messages/messageIndex';
import MessageForm from './Messages/messageForm'
import ChannelHeading from './Channels/channelHeading';

function Content({ isLoaded }) {

    return (
        <>
            <div id="grid-content-heading" className="grid-content-heading-threecolumn">
                <ChannelHeading />
            </div>
            <div id="grid-content" className="grid-content-threecolumn">
                <Messages />
            </div>
            <div id="grid-editor" className="grid-editor-threecolumn">
                <MessageForm />
            </div>
        </>
    );
}

export default Content;