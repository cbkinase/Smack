import React, { useState } from "react";
import ChannelHeader from './Channels/ChannelHeader';
import Messages from './Messages/Messages';
import Editor from './Editor/Editor';
import OneChannel from '../../OneChannel';
import CreateChannel from '../Content/Channels/ChannelCreator'
import EditChannel2 from '../Content/Channels/ChannelEditor'



function Content() {

    const [paneContent, setPaneContent] = useState('messages')

    return (
        <>
            <div id="grid-content-heading" className="grid-content-heading-threecolumn">
                <ChannelHeader setPane={setPaneContent} />
            </div>

            <div id="grid-content" className="grid-content-threecolumn">

                {paneContent === 'editChannel' && (<EditChannel2 setPane={setPaneContent} />)}

                {paneContent === 'messages' && (<Messages />)}

            </div>

            <div id="grid-editor" className="grid-editor-threecolumn">
                {paneContent === 'messages' && (<Editor />)}
            </div>

        </>
    );
}

export default Content;
