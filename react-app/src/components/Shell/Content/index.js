import React from 'react';
import ChannelHeader from './Channels/ChannelHeader';
import Messages from './Messages/Messages';
import Editor from './Editor/Editor';
import OneChannel from '../../OneChannel';
import CreateChannel from '../Content/Channels/ChannelCreator'
import EditChannel2 from '../Content/Channels/ChannelEditor'
import { Route, Switch } from "react-router-dom";



function Content({ isLoaded }) {

    return (
        <>
            <div id="grid-content-heading" className="grid-content-heading-threecolumn">
                <ChannelHeader />
            </div>

            <div id="grid-content" className="grid-content-threecolumn">


                <OneChannel />

                <CreateChannel />

                <EditChannel2 />

                <Messages />


            </div>
            <div id="grid-editor" className="grid-editor-threecolumn">
                <Editor />
            </div>
        </>
    );
}

export default Content;
