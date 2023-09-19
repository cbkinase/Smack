import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "./store/session";
import Shell from "./components/Shell";
import LoginSignupPage from "./components/LoginSignupPage";
import RouteIdProvider from "./context/RouteId/RouteIdProvider";
import LoadingSpinner from "./components/LoadingSpinner";
import LandingPage from "./components/LandingPage/index";
import { getCookie } from "./utils/cookieFunctions";

function App() {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasVisited, setHasVisited] = useState(!!getCookie("hasVisited"));

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
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		);
	}

	if (!sessionUser) {
		return <LoginSignupPage setHasVisited={setHasVisited} />;
	}

	return (
		<RouteIdProvider>
			<Shell isLoaded={isLoaded} />
		</RouteIdProvider>
	);
}

export default App;
