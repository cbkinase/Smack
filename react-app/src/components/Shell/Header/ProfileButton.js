import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, editUser, disconnectWebSocket } from "../../../store/session";
import { useNavigate } from "react-router-dom";
import RouteIdContext from "../../../context/RouteId/RouteIdContext";
import ActivityStatus from "../../ActivityStatus";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();
	const mainRef = useRef();
	const [routeId] = useContext(RouteIdContext);
	const socket = useSelector((state) => state.session.socket);
	const activityStyles = {
		position: "fixed",
		marginLeft: "-8px",
		marginTop: "-16px",
	};

	const toggleMenu = () => {
		setShowMenu((prev) => !prev);
	};

	const handleLogout = async (e) => {
		e.preventDefault();
		socket.emit("stopped_typing", {
			channel_id: routeId,
			user_id: user.id,
		});
		await dispatch(disconnectWebSocket());
		dispatch(logout()).then(() => navigate("/"));
	};

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!mainRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};
		document.addEventListener("click", closeDropdown);
		return () => document.removeEventListener("click", closeDropdown);
	}, [mainRef]);

	// ###### EDIT USER ######

	const [errors, setErrors] = useState([]);
	const [showType, setShowType] = useState("info");
	const [first_name, setFirstName] = useState(user.first_name);
	const [last_name, setLastName] = useState(user.last_name);
	const [avatar, setAvatar] = useState(user.avatar);
	const [bio, setBio] = useState(user.bio);

	const showInfo = useRef(null);
	const editInfo = useRef(null);

	useEffect(() => {
		const seeInfo = showInfo.current;
		const seeEdit = editInfo.current;

		setFirstName(user.first_name);
		setLastName(user.last_name);
		setAvatar(user.avatar);
		setBio(user.bio);
		setErrors([]);

		if (showType === "info") {
			seeInfo.style.display = "block";
			seeEdit.style.display = "none";
		} else {
			seeInfo.style.display = "none";
			seeEdit.style.display = "block";
		}
	}, [showType, user.first_name, user.last_name, user.avatar, user.bio]);

	const handleEditUser = async (e) => {
		e.preventDefault();
		const data = await dispatch(
			editUser(first_name, last_name, avatar, bio, user.id),
		);
		if (data) {
			setErrors(data);
		} else {
			setShowType("info");
		}
	};

	return (
		<>
			<div
				ref={mainRef}
				style={{ display: "flex", gap: "10px", alignItems: "center" }}
			>
				<button className="topright-avatar-btn" onClick={toggleMenu}>
					<img
						style={{
							borderRadius: "4px",
							width: "26px",
							height: "26px",
						}}
						src={user.avatar}
						alt={user.first_name + " " + user.last_name}
					/>
					<ActivityStatus
						user={user}
						iconOnly={"avatar"}
						styles={activityStyles}
					/>
				</button>

				<div
					className={ulClassName}
					ref={ulRef}
					style={{ padding: "0px", margin: "0px" }}
				>
					{/* =================== */}
					{/* VIEW USER INFO */}
					<div ref={showInfo} style={{ display: "block" }}>
						<div
							className="profile-popup"
							style={{
								padding: "12px 0px 2px 0px",
								margin: "0px",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "flex-start",
										alignItems: "center",
										padding: "0px",
										margin: "0px",
									}}
								>
									<div
										style={{
											padding: "0px",
											margin: "0px",
										}}
									>
										<img
											style={{
												borderRadius: "4px",
												width: "38px",
												height: "38px",
											}}
											src={user.avatar}
											alt=""
										/>
									</div>
									<div
										style={{
											padding: "0px",
											margin: "0px 0px 0px 10px",
											fontWeight: 700,
											maxWidth: "137px",
											overflow: "hidden",
										}}
									>
										{user.first_name} {user.last_name}
									</div>
								</div>

								<div>
									<button
										className="edit-user-btn"
										onClick={() => {
											setShowType("edit");
										}}
									>
										Edit
									</button>
								</div>
							</div>

							<div>{user.email}</div>
							<div
								style={{
									borderTop: "1px solid #cfcfcf",
									margin: "14px 0px 14px 0px",
									padding: "0px",
								}}
							></div>
							<div>{user.bio}</div>
							<div
								style={{
									borderTop: "1px solid #cfcfcf",
									margin: "14px 0px 0px 0px",
									padding: "0px",
								}}
							></div>
							<div>
								<button
									className="logout-btn"
									onClick={handleLogout}
								>
									Sign out of Smack
								</button>
							</div>
						</div>
					</div>
					{/* =================== */}

					{/* =================== */}
					{/* EDIT USER INFO */}
					<div ref={editInfo} style={{ display: "none" }}>
						<div
							className="profile-popup"
							style={{
								padding: "12px 0px 2px 0px",
								margin: "0px",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										padding: "0px",
										margin: "0px",
										width: "100%",
									}}
								>
									<div
										style={{
											padding: "0px",
											margin: "0px",
											width: "48px",
											height: "48px",
										}}
									>
										{avatar.length > 0 && (
											<img
												style={{
													borderRadius: "4px",
													width: "48px",
													height: "48px",
												}}
												src={avatar}
												alt=""
											/>
										)}
										{avatar.length === 0 && (
											<img
												style={{
													borderRadius: "4px",
													width: "48px",
													height: "48px",
												}}
												src="https://ca.slack-edge.com/T0266FRGM-UQ46QH94Z-gc24d346e359-512"
												alt=""
											/>
										)}
									</div>
								</div>
							</div>
							<form onSubmit={handleEditUser}>
								{errors.length > 0 && (
									<div
										style={{
											paddingTop: "20px",
											paddingLeft: "10px",
											color: "red",
											display: "block",
										}}
									>
										{errors.map((error, idx) => (
											<li key={idx}>{error}</li>
										))}
									</div>
								)}

								<div>
									<input
										className="edituser-input-field"
										type="text"
										value={avatar}
										name="avatar"
										autoComplete="off"
										onChange={(e) =>
											setAvatar(e.target.value)
										}
										placeholder="Avatar URL"
									/>
								</div>

								<div
									style={{
										borderTop: "1px solid #cfcfcf",
										margin: "6px 0px 6px 0px",
										padding: "0px",
									}}
								></div>

								<div>
									<input
										className="edituser-input-field"
										type="text"
										value={first_name}
										name="first-name"
										autoComplete="off"
										onChange={(e) =>
											setFirstName(e.target.value)
										}
										required
									/>
								</div>

								<div
									style={{
										borderTop: "1px solid #cfcfcf",
										margin: "6px 0px 6px 0px",
										padding: "0px",
									}}
								></div>

								<div>
									<input
										className="edituser-input-field"
										type="text"
										name="last-name"
										autoComplete="off"
										value={last_name}
										onChange={(e) =>
											setLastName(e.target.value)
										}
										required
									/>
								</div>

								<div
									style={{
										borderTop: "1px solid #cfcfcf",
										margin: "6px 0px 6px 0px",
										padding: "0px",
									}}
								></div>

								<div>
									<textarea
										className="edituser-input-field"
										style={{ resize: "none" }}
										name="about-me"
										autoComplete="off"
										rows={4}
										value={bio ?? ""}
										onChange={(e) => setBio(e.target.value)}
									/>
								</div>

								<div
									style={{
										borderTop: "1px solid #cfcfcf",
										margin: "4px 0px 8px 0px",
										padding: "0px",
									}}
								></div>

								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										gap: "5px",
										paddingBottom: "12px",
										alignItems: "center",
									}}
								>
									<div
										className="cancel-edit-user"
										style={{
											padding: "3px 5px",
											margin: "0px",
											color: "#797979",
										}}
										onClick={() => {
											setShowType("info");
										}}
									>
										Cancel
									</div>
									<button
										className="save-useredit-savebtn"
										type="submit"
									>
										Save
									</button>
									<div></div>
								</div>
							</form>
						</div>
					</div>
					{/* =================== */}
				</div>
			</div>
		</>
	);
}

export default ProfileButton;
