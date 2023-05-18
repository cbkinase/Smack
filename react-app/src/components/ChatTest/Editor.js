import ChatEmojiModal from "../ChatEmojiModal";
import OpenModalButton from "../OpenModalButton";
import userObjectToNameList from "../../utils/userObjectToNameList";
import { useState } from "react";
import { isImage, previewFilter } from "../Shell/Content/Messages/AttachmentFncs";

import loadingImg from '../../misc/Rolling-1s-200px (1).svg';

export default function Editor({ functions, creating, setChatInput, user, attachmentBuffer, attachmentIsLoading }) {
    const { sendChat, chatInput, updateChatInput, currentChannel, channelId, addAttachBuffer, removeAttachBuffer } =
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


    const [hoverAttachId, setHoverAttachId] = useState(0);
    const attachmentBufferArr = Object.values(attachmentBuffer);

    return (
        <>
            <div id="grid-editor" className="grid-editor-threecolumn">
                <div className="editor">
                    {attachmentBufferArr.length ? 
                    (<div className="editor-attachments-wrapper"
                         style={{
                            position: "relative",
                            top: "10px",
                            backgroundColor: "#f2f2f2",
                             padding: "8px 15px",
                             borderTop: "2px solid #dddddd",
                             borderLeft: "2px solid #dddddd",
                             borderRight: "2px solid #dddddd",
                             borderTopLeftRadius: "12px",
                             borderTopRightRadius: "12px",
                         }}
                    >
                        {attachmentBufferArr.map((file) => (
                            <div className="attachment-preview"
                                 key={file.id}
                                onMouseEnter={() => { setHoverAttachId(file.id) }}
                                onMouseLeave={() => { setHoverAttachId(0) }}
                            >   
                                {hoverAttachId === file.id ? 
                                <div className="attachment-name">
                                    {`${file.name.split(".")[0].substring(0,10)}...${file.name.split(".")[1]}`}
                                </div>
                                : null}

                                {isImage(file.name) ?
                                    <img

                                        src={URL.createObjectURL(file)}
                                        alt="attachment-preview">
                                    </img>
                                    :
                                    <img
                                        src={previewFilter(file.name)}
                                        alt="attachment-preview">
                                    </img>
                                }
                                
                                {!attachmentIsLoading && hoverAttachId === file.id ? 
                                    <button className="delete-attachment-btn"
                                            onClick={(e) => removeAttachBuffer(e, file.id)}
                                    >
                                        <i class="fa-solid fa-circle-xmark" style={{ color: "#000000", fontSize: "16px" }}></i>
                                    </button>
                                    : null
                                }
                                
                                {attachmentIsLoading ? 
                                    <img className="load-attachment"
                                        src={loadingImg}
                                        alt="attachment-loading"
                                    >
                                    </img>
                                : null}
                                

                            </div>
                            
                        ))}
                    </div>)
                    : null
                    }
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

                            className="message-adjust-attachment"
                        >
                            
                            <label for="attachment-upload" className="attachment-btn">
                                <i className="fa-solid fa-circle-plus" style={{ color: "black" }}></i>
                            </label>
                            <input id="attachment-upload"
                                    type="file" 
                                    accept="*"
                                    onChange={addAttachBuffer}
                            />
                            
                        </span>
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
