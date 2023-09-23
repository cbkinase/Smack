import React, { useState, useEffect, useRef } from "react";
import { login, signUp } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { deleteCookie, setCookie } from "../../utils/cookieFunctions";
import Footer from "./Subcomponents/Footer";
import LoginView from "./Subcomponents/LoginView";
import SignUpView from "./Subcomponents/SignUpView";
import LoginSignupTitle from "./Subcomponents/LoginSignupTitle";

function LoginSignupPage({ setHasVisited, mustActivate }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [username, setUsername] = useState("");
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);

	const [formType, setFormType] = useState("login");

	const signInForm = useRef(null);
	const signUpForm = useRef(null);
	const formTitle = useRef(null);

	useEffect(() => {
		const signIn = signInForm.current;
		const signUp = signUpForm.current;
		const titleText = formTitle.current;
		setEmail("");
		setPassword("");
		setUsername("");
		setFirstName("");
		setLastName("");
		setConfirmPassword("");
		setErrors([]);

		if (formType === "login") {
			signIn.style.display = "block";
			signUp.style.display = "none";
			titleText.innerText = "Sign in to Smack";
		} else {
			signIn.style.display = "none";
			signUp.style.display = "block";
			titleText.innerText = "Sign up for Smack";
		}
	}, [formType]);

	useEffect(() => {
		if (mustActivate) {
			setErrors([
				"You must log in before you can activate your account.",
			]);
		}
	}, [mustActivate]);

	if (sessionUser?.confirmed) return <Navigate to="/" />;

	const handleDemo = () => {
		setEmail("demo@aa.io");
		setPassword("verysecurepassword??xd");
	};

	const handleSubmitLogin = async (e) => {
		e.preventDefault();
		const data = await dispatch(login(email, password));
		if (data.error) {
			setErrors([data.message]);
			return;
		}
		setHasVisited(true);
		setCookie("hasVisited", "true");
		const user = data;
		// If the current user hasn't confirmed their account, redirect them to
		// page that prompts them to confirm their email address.
		if (user.confirmed) {
			navigate("/channels/explore");
		} else {
			navigate("/activate");
		}
	};

	const handleSubmitSignup = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(
				signUp(username, email, password, first_name, last_name),
			);
			if (data) {
				setErrors(data);
				return;
			}
		} else {
			setErrors(["Password does not match confirmation password."]);
			return;
		}
		setHasVisited(true);
		setCookie("hasVisited", "true");
		navigate("/activate");
	};

	const handleLogoClick = () => {
		deleteCookie("hasVisited");
		setHasVisited(false);
	};

	const commonProps = {
		email,
		setEmail,
		password,
		setPassword,
		setFormType,
		errors,
	};

	return (
		<>
			<div className="login-signup" style={{ height: "100%" }}>
				<LoginSignupTitle
					handleLogoClick={handleLogoClick}
					formTitle={formTitle}
				/>

				<LoginView
					{...commonProps}
					signInForm={signInForm}
					handleSubmitLogin={handleSubmitLogin}
					handleDemo={handleDemo}
				/>

				<SignUpView
					{...commonProps}
					signUpForm={signUpForm}
					handleSubmitSignup={handleSubmitSignup}
					first_name={first_name}
					setFirstName={setFirstName}
					last_name={last_name}
					setLastName={setLastName}
					username={username}
					setUsername={setUsername}
					confirmPassword={confirmPassword}
					setConfirmPassword={setConfirmPassword}
				/>
			</div>

			<Footer />
		</>
	);
}

export default LoginSignupPage;
