import React, { useState, useEffect, useRef } from "react";
import { login, signUp, logout } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, NavLink } from "react-router-dom";
import { deleteCookie, setCookie } from "../../utils/cookieFunctions";
import Footer from "./Subcomponents/Footer";
import LoginView from "./Subcomponents/LoginView";
import SignUpView from "./Subcomponents/SignUpView";
import LoginSignupTitle from "./Subcomponents/LoginSignupTitle";
import signinupLogo from "./smack-logo-black.svg";

function decodeUrlParameter(url, parameterName) {
	const params = new URLSearchParams(url.split("?")[1]);
	const parameterValue = params.get(parameterName);
	return parameterValue ? decodeURIComponent(parameterValue) : null;
}

function LoginSignupPage({ setHasVisited, mustActivate }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [OAuthLink, setOAuthLink] = useState(null);

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
		if (sessionUser && !sessionUser.confirmed) return;
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
	}, [formType, sessionUser]);

	useEffect(() => {
		if (mustActivate) {
			setErrors([
				"You must be logged in on this device to activate your account.",
			]);
		}
	}, [mustActivate]);

	useEffect(() => {
		document.title = "Login | Smack";
		return () => {
			document.title = "Smack";
		};
	}, []);

	// Ensure consistency of 'state' variable for OAuth
	// between components
	useEffect(() => {
		async function fetchData() {
			const baseURL = window.location.origin;
			const res = await fetch(
				`/api/auth/authorize/google?source=${encodeURIComponent(
					baseURL,
				)}`,
			);
			if (res.ok) {
				const data = await res.json();

				// Clean the URL's redirect_uri parameter
				const cleanedRedirectUri = decodeUrlParameter(
					data.message,
					"redirect_uri",
				);

				if (cleanedRedirectUri) {
					const cleanedURL = data.message.replace(
						`redirect_uri=${encodeURIComponent(
							cleanedRedirectUri,
						)}`,
						`redirect_uri=${cleanedRedirectUri}`,
					);
					setOAuthLink(cleanedURL);
				} else {
					setOAuthLink(data.message);
				}
				return data;
			}
		}
		fetchData();
	}, []);

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

	const handleLogout = () => {
		dispatch(logout());
	};

	const commonProps = {
		email,
		setEmail,
		password,
		setPassword,
		setFormType,
		errors,
		OAuthLink,
	};

	async function requestNewLink() {
		const baseURL = window.location.origin;
		await fetch(`/api/auth/confirm?source=${encodeURIComponent(baseURL)}`);
		navigate("/resend");
	}

	// Not the DRYest, lol TODO
	if (sessionUser && !sessionUser.confirmed) {
		return (
			<>
				<div className="login-signup" style={{ height: "100%" }}>
					<div style={{ textAlign: "center" }}>
						<NavLink onClick={handleLogoClick} to="/">
							<img
								src={`${signinupLogo}`}
								alt="Smack Logo"
								style={{ width: "145px " }}
							/>
						</NavLink>
					</div>

					<h1
						style={{
							textAlign: "center",
							fontSize: "48px",
							fontWeight: "700",
							paddingTop: "30px",
							paddingBottom: "14px",
						}}
					>
						Already signed in
					</h1>
					<div style={{ display: "block", marginBottom: "90px" }}>
						<div
							style={{
								textAlign: "center",
								fontSize: "18px",
								color: "#454245",
							}}
						>
							But your account has yet to be activated.
							<div style={{ height: "20px" }} />
							Sign out below, or activate at{" "}
							<b>{sessionUser.email}</b>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "12px",
								paddingTop: "26px",
							}}
						>
							<button
								className="login-input-submit"
								onClick={handleLogout}
							>
								Log out
							</button>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "30px 0px",
							}}
						>
							<div
								style={{
									height: "1px",
									width: "100%",
									backgroundColor: "#dddddd",
								}}
							></div>
							<div
								style={{
									padding: "0px 20px",
								}}
							>
								OR
							</div>
							<div
								style={{
									height: "1px",
									width: "100%",
									backgroundColor: "#dddddd",
								}}
							></div>
						</div>
						<div
							style={{
								textAlign: "center",
								fontSize: "18px",
								color: "#454245",
							}}
						>
							Need a new code?&nbsp;&nbsp;&nbsp;<b>No problem!</b>
							<br />
							<button
								className="create-account"
								onClick={requestNewLink}
							>
								Request a new activation link
							</button>
						</div>
					</div>
				</div>
				<Footer />
			</>
		);
	}

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
