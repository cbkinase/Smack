import EditModalHeader from "./EditModalHeader";
import { useModal } from "../../../context/Modal/Modal";

export default function MemberView({ owner, user, currChannel  }) {
    const { closeModal } = useModal();
    return (
        <div className="edit-modal-container">

            <EditModalHeader currChannel={currChannel} user={user} closeModal={closeModal} />
            <div className='edit-modal-tabs-menu'></div>

            <form className="edit-modal-form">

                <div className="edit-modal-form-box">
                <div style={{height: "10px"}}></div>
                    <label style={{paddingTop: "0px", marginLeft: "7px"}} htmlFor="name"> Channel name </label>
                    <input
                        disabled={true}
                        type="text"
                        id="name"
                        value={currChannel.name}
                    ></input>
                    <div className="edit-modal-border"></div>
                    <label style={{marginLeft: "7px"}} htmlFor="subject"> Topic </label>
                    <input
                        disabled={true}
                        type="text"
                        id="subject"
                        placeholder="Add a Topic"
                        value={currChannel.subject}
                    ></input>

                </div>

                {!currChannel.is_direct ?
                    <div className="edit-modal-form-box">
                        <div style={{paddingLeft: "7px", fontWeight: "bold"}}>Created by</div>
                        <div id="edit-owner-name">{`${owner.first_name} ${owner.last_name}`}</div>
                    </div>
                    : null}

            </form>
        </div>
    )
}
