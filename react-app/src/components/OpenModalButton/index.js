import React from "react";
import { useModal } from "../../context/Modal/Modal";

function OpenModalButton({
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose, // optional: callback function that will be called once the modal is closed
    className,
    renderChatIcon,
    userList,
    numMemb,
    renderDownArrow,
    currUser,
    renderPencil,
    renderPersonPlus
}) {
    if (userList && userList.length > 1) {
        userList = JSON.parse(JSON.stringify(userList));
        userList = userList.filter(user => user.id !== currUser.id)
    }


    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (typeof onButtonClick === "function") onButtonClick();
        if (typeof onModalClose === "function") setOnModalClose(onModalClose);
        setModalContent(modalComponent);
    };

    return (
        <button style={{ whiteSpace: 'nowrap', border: 'none' }} className={className} onClick={onClick}>

            {renderChatIcon && <span style={{ width: "20px" }}><i className="far fa-comment"></i></span>}

            {numMemb && numMemb >= 4 ? <div className="content-header-membercount" style={{ backgroundColor: '#FFFFFF' }}>
                <img style={{ zIndex: 5 }} className="membercount-image"
                    src={userList && userList[0].avatar}
                    alt="Member"></img>
                <img style={{ zIndex: 4, position: "relative", left: "-8px" }} className="membercount-image"
                    src={userList && userList[1].avatar}
                    alt="Member"></img>
                <img style={{ zIndex: 3, position: "relative", left: "-16px" }} className="membercount-image"
                    src={userList && userList[2].avatar}
                    alt="Member"></img>
                <span style={{ zIndex: 4, position: "relative", left: "-8px" }}>{numMemb}</span>
            </div > : null}

            {numMemb && numMemb === 3 ? <div className="content-header-membercount" style={{ backgroundColor: '#FFFFFF' }}>
                <img style={{ zIndex: 5 }} className="membercount-image"
                    src={userList && userList[0].avatar} alt=''></img>
                <img style={{ zIndex: 4, position: "relative", left: "-8px" }} className="membercount-image"
                    src={userList && userList[1].avatar} alt=''></img>
                <span style={{ zIndex: 3, position: "relative", left: "-3px" }}>{numMemb}</span>
            </div> : null}

            {numMemb && numMemb < 3 ? <div className="content-header-membercount" style={{ backgroundColor: '#FFFFFF' }}>
                <img className="membercount-image"
                    src={userList && userList[0].avatar} alt=''></img>
                <span style={{ padding: "0px 5px" }}>{numMemb}</span>
            </div> : null}

            {renderPersonPlus &&
                <span style={{paddingRight: "8px"}}>
                    <i className="fa-solid fa-user-plus"></i>
                </span>}

            {renderPencil && <span style={{paddingRight: "8px"}}><i className="fa fa-pencil"></i></span>}

            {buttonText}

            {renderDownArrow && <span style={{ fontSize: "10px", paddingLeft: "5px" }}><i className="fa-sharp fa-solid fa-chevron-down"></i></span>}
        </button>
    );
}

export default OpenModalButton;
