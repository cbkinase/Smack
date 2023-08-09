import React, { useRef } from "react";
import ChannelHeader from "./Channels/ChannelHeader";
import Messages from "./Messages/Messages";

function Content() {
    // The container for messages, which must be referenced to know if we've reached the top
    // of our container to implement infinite scrolling.
    const scrollContainerRef = useRef(null);
    return (
        <>
            <div
                id="grid-content-heading"
                className="grid-content-heading-threecolumn"
            >
                <ChannelHeader />

            </div>

            <div ref={scrollContainerRef} id="grid-content" className="grid-content-threecolumn" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                <Messages scrollContainerRef={scrollContainerRef} />

            </div>
            {/* <div id="grid-editor" className="grid-editor-threecolumn"> */}
            {/* <Editor /> */}
            {/* </div> */}
        </>
    );
}

export default Content;
