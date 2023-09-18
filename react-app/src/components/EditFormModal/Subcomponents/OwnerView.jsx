import { useModal } from "../../../context/Modal/Modal";
import EditModalHeader from "./EditModalHeader";

const ErrorList = ({ errors, hasSubmitted }) => (
    <ul style={{ paddingTop: '10px', margin: '0px 0px 0px 28px', color: 'red' }}>
        {hasSubmitted && Object.values(errors).map((error, idx) => (
            <li key={idx} className="edit-errors">{error}</li>
        ))}
    </ul>
);

export default function OwnerView({ errors, setName, currChannel, handleDelete,
                                    handleSubmit, confirmDeleteName, setConfirmDeleteName,
                                    name, hasSubmitted, user, subject, setSubject }) {
    const { closeModal } = useModal();
    return (
        <div className="edit-modal-container">
            <EditModalHeader currChannel={currChannel} user={user} closeModal={closeModal} />
            {/* <div className='edit-modal-tabs-menu'></div> */}

            <form onSubmit={handleSubmit} className="edit-modal-form">

                <div className="edit-modal-form-box">
                    <ErrorList errors={errors} hasSubmitted={hasSubmitted} />
                    <label style={{ paddingLeft: "7px" }} htmlFor="name"> Channel name </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Add a Channel name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></input>
                    <div className="edit-modal-border"></div>
                    <label style={{ paddingLeft: "7px" }} htmlFor="subject"> Topic </label>
                    <input
                        type="text"
                        id="subject"
                        placeholder="Add a Topic"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    ></input>

                    <button
                        className="decorated-button-edit-channel"
                        disabled={(name === currChannel.name && subject === currChannel.subject) ||
                            Object.values(errors).length}
                        onClick={handleSubmit}
                    >
                        Edit channel
                    </button>
                </div>

                {!currChannel.is_direct ?
                    <div className="edit-modal-form-box">
                        <div style={{ height: "5px" }}></div>
                        <label style={{ marginLeft: "7px" }} htmlFor="confirm-delete">Channel deletion</label>
                        <div style={{ height: "10px" }}></div>
                        <p style={{ marginLeft: "7px", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>Type "<span style={{ color: "#631965", fontWeight: "bold" }}>{currChannel.name}</span>" below to confirm the deletion of the channel</p>
                        <input
                            autoComplete="off"
                            type="text"
                            id="confirm-delete"
                            value={confirmDeleteName}
                            onChange={(e) => setConfirmDeleteName(e.target.value)} />
                        <button disabled={confirmDeleteName !== currChannel.name} className="decorated-button-delete-channel" onClick={handleDelete}>Delete channel</button>
                    </div> : null}
            </form>
        </div>
    )
}
