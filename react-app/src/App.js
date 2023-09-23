import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "./store/session";
import Shell from "./components/Shell";
import LoginSignupPage from "./components/LoginSignupPage";
import RouteIdProvider from "./context/RouteId/RouteIdProvider";
import LoadingSpinner from "./components/LoadingSpinner";
import LandingPage from "./components/LandingPage/index";
import useCookieState from "./hooks/useCookieState";
import ConfirmEmail from "./components/ConfirmEmail";
import ConfirmResend from "./components/ConfirmEmail/ConfirmResend";
import Activation from "./components/ConfirmEmail/Activation";

function App() {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasVisited, setHasVisited] = useCookieState("hasVisited");

	useEffect(() => {
		dispatch(authenticate()).then(() => setIsLoaded(true));
	}, [dispatch]);

	const sessionUser = useSelector((state) => state.session.user);

	if (!isLoaded) return <LoadingSpinner />;

	if (!sessionUser && !hasVisited) {
		return (
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route
					path="/login"
					element={<LoginSignupPage setHasVisited={setHasVisited} />}
				/>
				<Route
					path="/activate"
					element={
						<LoginSignupPage
							mustActivate
							setHasVisited={setHasVisited}
						/>
					}
				/>
				<Route
					path="/activate/:token"
					element={
						<LoginSignupPage
							mustActivate
							setHasVisited={setHasVisited}
						/>
					}
				/>
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		);
	}

	if (!sessionUser) {
		return (
			<Routes>
				<Route
					path="/"
					element={<LoginSignupPage setHasVisited={setHasVisited} />}
				/>
				<Route
					path="/activate"
					element={
						<LoginSignupPage
							mustActivate
							setHasVisited={setHasVisited}
						/>
					}
				/>
				<Route
					path="/activate/:token"
					element={
						<LoginSignupPage
							mustActivate
							setHasVisited={setHasVisited}
						/>
					}
				/>
				<Route
					path="*"
					element={<LoginSignupPage setHasVisited={setHasVisited} />}
				/>
			</Routes>
		);
	}

	if (sessionUser && !sessionUser.confirmed) {
		return (
			<Routes>
				<Route
					path="/"
					element={<LoginSignupPage setHasVisited={setHasVisited} />}
				/>
				<Route
					path="/login"
					element={<LoginSignupPage setHasVisited={setHasVisited} />}
				/>
				<Route
					path="/activate"
					element={
						<ConfirmEmail
							setHasVisited={setHasVisited}
							user={sessionUser}
						/>
					}
				/>
				<Route
					path="/activate/:token"
					element={
						<Activation
							user={sessionUser}
							setHasVisited={setHasVisited}
						/>
					}
				/>
				<Route
					path="/resend"
					element={
						<ConfirmResend
							setHasVisited={setHasVisited}
							user={sessionUser}
						/>
					}
				/>
				<Route
					path="*"
					element={
						<ConfirmEmail
							setHasVisited={setHasVisited}
							user={sessionUser}
						/>
					}
				/>
			</Routes>
		);
	}

	return (
		<RouteIdProvider>
			<Shell isLoaded={isLoaded} />
		</RouteIdProvider>
	);
}

export default App;
