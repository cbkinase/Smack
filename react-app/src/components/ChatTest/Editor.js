import ChatEmojiModal from "../ChatEmojiModal";
import OpenModalButton from "../OpenModalButton";
import userObjectToNameList from "../../utils/userObjectToNameList";

export default function Editor({ functions, creating, setChatInput, user }) {
    const { sendChat, chatInput, updateChatInput, currentChannel, channelId } =
        functions;
    function changeAdjustText(text, id) {
        document.getElementById(`message-adjust-text-${id}`).textContent = text;
    }
    function determineName(channel, user) {
        // The name displayed must be different depending on whether it's a DM or not.
        if (!channel.is_direct) return `# ${channel.name}`
        else if (channel.is_direct && Object.values(channel.Members).length > 1) {
            return userObjectToNameList(channel.Members, user)
        }
        else return `${user.first_name} ${user.last_name}`

    }
    return (
        <>
            <div id="grid-editor" className="grid-editor-threecolumn">
                <div className="editor">
                    <div
                        style={{
                            backgroundColor: "#f2f2f2",
                            padding: "8px 15px",
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
                                        ? `Message ${determineName(currentChannel[channelId], user)}`
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
