import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EditChannelThunk } from "../../store/channel"
import { DeleteChannelThunk } from "../../store/channel"
import { useModal } from "../../context/Modal";
import './EditChannelModalStyling.css'

const EditChannelModal = ({channelId, currChannel, user}) => {
    const [name, setName] = useState(currChannel[0]?.name || "");
    const [subject, setSubject] = useState(currChannel[0]?.subject || "");
    const [is_private, setIsPrivate] = useState(false);
    const [is_direct, setIsDirect] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    let owner;

    useEffect(() => {
        setErrors({});
        const err = {};
        if (!name.length) err["name"] = "Name field must not be empty";
        if (name.length > 80) err["name"] = "Name can’t be longer than 80 characters."
        if (!subject.length) err["subject"] = "Channel topics cannot be empty "
        if (subject.length > 250) err["subject"] = "Channel topics must be max 250 characters long "

        setErrors(err)
    }, [name, subject])


    const handleSubmit = (e) => {
        e.preventDefault();

        if (Object.values(errors).length) return alert(`Oops, something went wrong with renaming the channel. Please try again.`);

        dispatch(
            EditChannelThunk(channelId, {
                name: name,
                subject: subject,
                is_private: Boolean(is_private),
                is_direct: Boolean(is_direct),
            })
        );
        if (!Object.values(errors).length) {
            closeModal()
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(DeleteChannelThunk(channelId));
        history.push('/channels/explore');
        closeModal();
    };

    if (currChannel.length) {
        owner = Object.values(currChannel[0].Members).filter((user) => (user.id === currChannel[0].owner_id));
    }

    return (
        currChannel.length && user.id === currChannel[0].owner_id ?
            (
                <div className="edit-modal-container">
                    <div style={{paddingLeft: "17px"}}className='edit-modal-header'>
                        <div>&nbsp;</div>
                        <div className='edit-modal-title'>{`# ${currChannel[0].name}`}</div>

                        <button className="edit-modal-close-btn" onClick={() => closeModal()}>
                            <i className="fa-solid fa-x"></i>
                        </button>
                    </div>
                    <div className='edit-modal-tabs-menu'></div>

                    <form onSubmit={handleSubmit} className="edit-modal-form">

                        <div className="edit-modal-form-box">
                            <ul style={{ padding: '0px', margin: '2px 0px 20px 8px', color: 'red' }}>
                                {Object.values(errors).map((error, idx) => (
                                    <li key={idx} className="edit-errors">
                                        {error}
                                    </li>
                                ))}
                            </ul>
                            <label style={{paddingLeft: "7px"}} htmlFor="name"> Channel name </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Add a Channel name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                            <div className="edit-modal-border"></div>
                            <label style={{paddingLeft: "7px"}} htmlFor="subject"> Topic </label>
                            <input
                                type="text"
                                id="subject"
                                placeholder="Add a Topic"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            ></input>

                            <button
                                className="decorated-button-edit-channel"
                                disabled={(name === currChannel[0].name && subject === currChannel[0].subject) ||
                                          Object.values(errors).length}
                                onClick={handleSubmit}
                            >
                                Edit channel
                            </button>
                        </div>

                        <div className="edit-modal-form-box">
                            <div style={{paddingLeft: "7px", fontWeight: "bold"}}>Created by</div>
                            <div id="edit-owner-name">{`${owner[0].username}`}</div>
                            <button className="decorated-button-delete-channel" onClick={handleDelete}>Delete channel</button>
                        </div>


                    </form>
                </div>
            )
        :
            (
                <div className="edit-modal-container">
                    <div className='edit-modal-header'>
                        <div>&nbsp;</div>
                        <div className='edit-modal-title'>{`# ${currChannel[0].name}`}</div>

                        <button className="edit-modal-close-btn" onClick={() => closeModal()}>
                            <i className="fa-solid fa-x"></i>
                        </button>
                    </div>
                    <div className='edit-modal-tabs-menu'></div>

                    <form onSubmit={handleSubmit} className="edit-modal-form">
                        <ul style={{ padding: '0px', margin: '2px 0px 20px 8px', color: 'red' }}>
                            {Object.values(errors).map((error, idx) => (
                                <li key={idx} className="edit-errors">
                                    {error}
                                </li>
                            ))}
                        </ul>
                        <div className="edit-modal-form-box">
                            <label htmlFor="name"> Channel name </label>
                            <input
                                disabled={true}
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                            <div className="edit-modal-border"></div>
                            <label htmlFor="subject"> Topic </label>
                            <input
                                disabled={true}
                                type="text"
                                id="subject"
                                placeholder="Add a Topic"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            ></input>

                        </div>

                        <div className="edit-modal-form-box">
                            <div>Created by</div>
                            <div id="edit-owner-name">{`${owner[0].username}`}</div>
                        </div>


                    </form>
                </div>

            )
    )
};

export default EditChannelModal;
