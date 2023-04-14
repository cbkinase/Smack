export default function Editor({ functions, creating }) {
    const { sendChat, chatInput, updateChatInput, currentChannel, channelId } =
        functions;
    return (
        <>
            <div id="grid-editor" className="grid-editor-threecolumn">
                <div className="editor">
                    <div
                        style={{
                            backgroundColor: "#f2f2f2",
                            padding: "15px",
                            borderTop: "2px solid #dddddd",
                            borderLeft: "2px solid #dddddd",
                            borderRight: "2px solid #dddddd",
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px",
                        }}
                    >
                        <span>Bold | Italic | Strikethrough | etc.</span>
                    </div>
                    <div>
                        <form
                            onSubmit={
                                creating
                                    ? sendChat
                                    : alert("Edit Not yet implemented ")
                            }
                        >
                            <input
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    color: "#00000",
                                    height: "60px",
                                    padding: "15px",
                                    borderTop: "none",
                                    borderBottom: "2px solid #dddddd",
                                    borderLeft: "2px solid #dddddd",
                                    borderRight: "2px solid #dddddd",
                                    borderBottomLeftRadius: "12px",
                                    borderBottomRightRadius: "12px",
                                    width: "100%",
                                }}
                                value={chatInput}
                                onChange={updateChatInput}
                                placeholder={`Message # ${currentChannel[channelId]?.name}`}
                            />
                            <button hidden type="submit">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
