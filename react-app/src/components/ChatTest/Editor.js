import ChatEmojiModal from "../ChatEmojiModal";
import OpenModalButton from "../OpenModalButton";

export default function Editor({ functions, creating, setChatInput }) {
    const { sendChat, chatInput, updateChatInput, currentChannel, channelId } =
        functions;
    function changeAdjustText(text, id) {
        document.getElementById(`message-adjust-text-${id}`).textContent = text;
    }
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
                        <span

                            className="message-adjust-reaction"
                        >
                            <OpenModalButton
                                modalComponent={
                                    <ChatEmojiModal
                                        setChatInput={setChatInput}
                                        chatInput={chatInput}
                                    />
                                }
                                className="far fa-smile"
                            />
                        </span>
                        {chatInput.length > 300 && <div style={{ color: "red" }}>
                            {2000 - chatInput.length} Characters Remaining
                        </div>}
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
                                className="editor-focus"
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
                                placeholder={
                                    currentChannel[channelId]
                                        ? `Message # ${currentChannel[channelId].name}`
                                        : " "
                                }
                            />
                            <button hidden disabled={chatInput.length === 0 || chatInput.length > 2000} type="submit">
                                Send
                            </button>
                        </form>
                        <div style={{ height: '20px' }}></div>
                    </div>
                </div>
            </div>
        </>
    );
}
