import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, disconnectWebSocket } from "./store/session";
import Shell from "./components/Shell";
import LoginSignupPage from "./components/LoginSignupPage";
import RouteIdProvider from "./context/RouteId/RouteIdProvider";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

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

    return (
        <>{!isLoaded ?
            <LoadingSpinner /> : sessionUser
            ? <RouteIdProvider>
                    <Shell isLoaded={isLoaded} />
              </RouteIdProvider>

            : <LoginSignupPage />}</>
    );
}

export default App;
