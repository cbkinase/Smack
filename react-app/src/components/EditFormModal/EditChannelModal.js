import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EditChannelThunk, DeleteChannelThunk } from "../../store/channel";
import { useModal } from "../../context/Modal/Modal";
import "./EditChannelModalStyling.css";
import OwnerView from "./Subcomponents/OwnerView";
import MemberView from "./Subcomponents/MemberView";

const EditChannelModal = ({ channelId, currChannel, user }) => {
	const [name, setName] = useState(currChannel?.name || "");
	const [subject, setSubject] = useState(currChannel?.subject || "");
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [confirmDeleteName, setConfirmDeleteName] = useState("");

	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { closeModal } = useModal();

	useEffect(() => {
		setErrors({});
		const err = {};
		if (!currChannel.is_direct && !name.length)
			err.name = "Name field must not be empty";
		if (name.length > 80)
			err.name = "Name can’t be longer than 80 characters.";
		if (subject.length > 250)
			err.subject = "Channel topic must not exceed 250 characters";

		setErrors(err);
	}, [name, subject, currChannel.is_direct]);

	if (!currChannel) return null;

	const handleSubmit = (e) => {
		e.preventDefault();
		setHasSubmitted(true);

		if (Object.values(errors).length) {
			return alert(
				"Oops, something went wrong with renaming the channel. Please try again.",
			);
		}

		dispatch(
			EditChannelThunk(channelId, {
				name,
				subject,
				is_private: currChannel.is_private,
				is_direct: currChannel.is_direct,
			}),
		);
		if (!Object.values(errors).length) {
			closeModal();
		}
	};

	const handleDelete = (e) => {
		e.preventDefault();
		dispatch(DeleteChannelThunk(channelId));
		navigate("/channels/explore");
		closeModal();
	};

	const ownerId = currChannel.owner_id;
	const memList = currChannel.Members;
	const owner = memList[ownerId];
	const isUserOwner = user.id === currChannel.owner_id;

	const commonProps = {
		owner,
		user,
		currChannel,
	};

	if (isUserOwner) {
		return (
			<OwnerView
				{...commonProps}
				errors={errors}
				hasSubmitted={hasSubmitted}
				handleSubmit={handleSubmit}
				handleDelete={handleDelete}
				name={name}
				setName={setName}
				confirmDeleteName={confirmDeleteName}
				setConfirmDeleteName={setConfirmDeleteName}
				subject={subject}
				setSubject={setSubject}
			/>
		);
	} else {
		return <MemberView {...commonProps} />;
	}
};

export default EditChannelModal;
