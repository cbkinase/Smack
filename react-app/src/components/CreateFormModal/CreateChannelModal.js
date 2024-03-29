import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AddChannelThunk } from "../../store/channel";
import { useModal } from "../../context/Modal/Modal";
import "../EditFormModal/EditChannelModalStyling.css";

const CreateChannelModal = () => {
	const [name, setName] = useState("");
	const [subject, setSubject] = useState("");
	const [hasSubmitted, setHasSubmitted] = useState(false);
	// const [is_private, setIsPrivate] = useState(false);
	// const [is_direct, setIsDirect] = useState(false);
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { closeModal } = useModal();

	useEffect(() => {
		setErrors({});
		const err = {};
		if (!name.length) err.name = "Name field must not be empty";
		if (name.length > 80)
			err.name = "Name can’t be longer than 80 characters.";
		if (subject.length > 250)
			err.subject = "Channel topics must be max 250 characters long ";

		setErrors(err);
	}, [name, subject]);

	const handleSubmit = async (e) => {
		setHasSubmitted(true);
		e.preventDefault();

		if (Object.values(errors).length)
			return alert(
				"Oops, something went wrong with creating the channel. Please try again.",
			);

		const created = dispatch(
			AddChannelThunk({
				name,
				subject,
				is_private: false,
				is_direct: false,
			}),
		);
		const channelInfo = await created;

		if (channelInfo.error)
			return alert(
				"Oops, something went wrong with creating the channel. Please try again.",
			);

		if (!Object.values(errors).length && !created.error) {
			navigate(`/channels/${channelInfo.id}`);
			closeModal();
		}
	};

	return (
		<div className="edit-modal-container">
			<div className="edit-modal-header">
				<div
					style={{ paddingLeft: "7px" }}
					className="edit-modal-title"
				>
					{"Create a new channel"}
				</div>

				<button
					style={{ top: "24px" }}
					className="edit-modal-close-btn"
					onClick={() => closeModal()}
				>
					<i className="fa-solid fa-x"></i>
				</button>
			</div>
			<div className="edit-modal-tabs-menu"></div>

			<form onSubmit={handleSubmit} className="edit-modal-form">
				<div className="edit-modal-form-box">
					<ul
						style={{
							paddingTop: "10px",
							margin: "0px 0px 0px 25px",
							color: "red",
						}}
					>
						{hasSubmitted &&
							Object.values(errors).map((error, idx) => (
								<li key={idx} className="edit-errors">
									{error}
								</li>
							))}
					</ul>
					<label style={{ paddingLeft: "7px" }} htmlFor="name">
						{" "}
						Channel name{" "}
					</label>
					<input
						type="text"
						id="name"
						value={name}
						placeholder="Add a channel name"
						onChange={(e) => setName(e.target.value)}
					></input>
					<div className="edit-modal-border"></div>
					<label style={{ paddingLeft: "7px" }} htmlFor="subject">
						{" "}
						Topic{" "}
					</label>
					<input
						type="text"
						id="subject"
						placeholder="Add a Topic"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
					></input>
				</div>

				<div className="edit-modal-form-box">
					<button
						className="decorated-button-edit-channel"
						disabled={name.length === 0}
						onClick={handleSubmit}
					>
						Create new channel
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateChannelModal;
