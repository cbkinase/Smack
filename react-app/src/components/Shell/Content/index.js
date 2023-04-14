import React from "react";
import ChannelHeader from "./Channels/ChannelHeader";
import Messages from "./Messages/Messages";
import Editor from "./Editor/Editor";

function Content({ isLoaded }) {
    return (
        <>
            <div
                id="grid-content-heading"
                className="grid-content-heading-threecolumn"
            >
                <ChannelHeader />
            </div>
            <div id="grid-content" className="grid-content-threecolumn">
                <Messages />
            </div>
            <div id="grid-editor" className="grid-editor-threecolumn">
                {/* <Editor /> */}
            </div>
        </>
    );
}

export default Content;
