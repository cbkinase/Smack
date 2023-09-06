import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, disconnectWebSocket } from "./store/session";
import Shell from "./components/Shell";
import LoginSignupPage from "./components/LoginSignupPage";
import RouteIdProvider from "./context/RouteId/RouteIdProvider";
import LoadingSpinner from "./components/LoadingSpinner";
import LandingPage from "./components/LandingPage/index"
import { getHasVisitedCookie, setHasVisitedCookie } from "./utils/cookieFunctions";

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const hasVisited = getHasVisitedCookie();

    useEffect(() => {
        dispatch(authenticate()).then(() => setIsLoaded(true));

        // Disconnect the socket when the window is about to be closed
        const handleBeforeUnload = () => {
            dispatch(disconnectWebSocket());
        };

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener on App unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dispatch]);

    const sessionUser = useSelector((state) => state.session.user);

    if (!isLoaded) return <LoadingSpinner />;

    if (!sessionUser && !hasVisited) {
        return (
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginSignupPage />} />
            </Routes >
        )
    }

    if (!sessionUser) {
        return (
            <LoginSignupPage />
        )
    }

    setHasVisitedCookie();

    return (
        <RouteIdProvider>
            <Shell isLoaded={isLoaded} />
        </RouteIdProvider>
    )


}

export default App;
