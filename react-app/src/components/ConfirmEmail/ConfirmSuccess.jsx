import ConfirmHeader from "./ConfirmHeader";
import ConfirmBody from "./ConfirmBody";
import Footer from "../LoginSignupPage/Subcomponents/Footer";
import { deleteCookie } from "../../utils/cookieFunctions";

export default function ConfirmSuccess({ user, setHasVisited }) {
	const handleLogoClick = () => {
		deleteCookie("hasVisited");
		setHasVisited(false);
	};

	return (
		<>
			<div className="login-signup" style={{ height: "100%" }}>
				<ConfirmHeader
					resend
					user={user}
					handleLogoClick={handleLogoClick}
				/>
				<ConfirmBody resend user={user} />
			</div>
			<Footer />
		</>
	);
}
