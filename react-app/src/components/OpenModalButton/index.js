import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalButton({
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose, // optional: callback function that will be called once the modal is closed
    className,
    renderChatIcon
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (typeof onButtonClick === "function") onButtonClick();
        if (typeof onModalClose === "function") setOnModalClose(onModalClose);
        setModalContent(modalComponent);
    };

    return (
        <button  style={{ whiteSpace: 'nowrap' }} className={className} onClick={onClick}>
        {renderChatIcon && <span style={{ width: "20px" }}><i className="far fa-comment"></i></span>}
        {buttonText}
        </button>
    );
}

export default OpenModalButton;
