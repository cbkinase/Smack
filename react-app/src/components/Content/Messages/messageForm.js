import React from 'react';

function MessageForm() {

    return (
        <div className="editor">
            <div
                style={{backgroundColor: "#f2f2f2", padding: "15px", borderTop: "2px solid #dddddd", borderLeft:"2px solid #dddddd", borderRight:"2px solid #dddddd", borderTopLeftRadius: "12px", borderTopRightRadius: "12px"}}>
                Bold | Italic | Strikethrough | etc.
            </div>
            <div
                style={{backgroundColor: "#FFFFFF", color:"#dddddd", height:"60px", padding: "15px", borderBottom:"2px solid #dddddd", borderLeft:"2px solid #dddddd", borderRight:"2px solid #dddddd", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px"}}>
                Message #Channel Name
            </div>
        </div>
    );
}

export default MessageForm;