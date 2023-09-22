import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setCookie } from "../../utils/cookieFunctions";
import { useDispatch } from "react-redux";
import { authenticate } from "../../store/session";

export default function Activation({ user, setHasVisited }) {
	const { token } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		async function activateAccount() {
			const res = await fetch(`/api/auth/confirm/${user.id}/${token}`);
			const data = await res.json();
			if (data.success) {
				setHasVisited(true);
				setCookie("hasVisited", "true");
			}
		}
		activateAccount();
		dispatch(authenticate()).then(() => navigate("/"));
	}, [token, user, navigate, setHasVisited, dispatch]);
	return <h1>Hello! Something went wrong if you're seeing this...</h1>;
}
