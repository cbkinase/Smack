import ConfirmHeader from "./ConfirmHeader";
import ConfirmBody from "./ConfirmBody";
import Footer from "../LoginSignupPage/Subcomponents/Footer";
import { deleteCookie } from "../../utils/cookieFunctions";

export default function ConfirmEmail({ user, setHasVisited }) {
	const handleLogoClick = () => {
		deleteCookie("hasVisited");
		setHasVisited(false);
	};

	return (
		<>
			<div className="login-signup" style={{ height: "100%" }}>
				<ConfirmHeader user={user} handleLogoClick={handleLogoClick} />
				<ConfirmBody user={user} />
			</div>
			<Footer />
		</>
	);
}
