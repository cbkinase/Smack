import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setCookie } from "../../utils/cookieFunctions";
import { useDispatch } from "react-redux";
import { authenticate } from "../../store/session";
import { deleteCookie } from "../../utils/cookieFunctions";
import ConfirmHeader from "./ConfirmHeader";
import ConfirmBody from "./ConfirmBody";
import Footer from "../LoginSignupPage/Subcomponents/Footer";
import LoadingSpinner from "../LoadingSpinner";

export default function Activation({ user, setHasVisited }) {
	const { token } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);

	const handleLogoClick = () => {
		deleteCookie("hasVisited");
		setHasVisited(false);
	};

	useEffect(() => {
		async function attemptActivateAccount() {
			const res = await fetch(`/api/auth/confirm/${user.id}/${token}`);
			const data = await res.json();
			setHasVisited(true);
			setCookie("hasVisited", "true");
			return data;
		}
		attemptActivateAccount().then((res) => {
			if (res.status === "success")
				dispatch(authenticate()).then(() => navigate("/"));
		});
		setIsLoading(false);
	}, [token, user, navigate, setHasVisited, dispatch]);

	if (isLoading) return <LoadingSpinner />;

	return (
		<>
			<div className="login-signup" style={{ height: "100%" }}>
				<ConfirmHeader
					activationFailed
					user={user}
					handleLogoClick={handleLogoClick}
				/>
				<ConfirmBody activationFailed user={user} />
			</div>
			<Footer />
		</>
	);
}
