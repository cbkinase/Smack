import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
// import SignupFormPage from "./components/SignupFormPage";
// import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
// import Header from "./components/Shell/Header";
import Shell from "./components/Shell";
import LoginSignupPage from "./components/LoginSignupPage";
import Chat from "./components/ChatTest";

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        dispatch(authenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const sessionUser = useSelector((state) => state.session.user);

    return (
        <>
            {sessionUser ? (
                <Shell isLoaded={isLoaded} />
            ) : (
                // <Switch>
                //     <Route path="/chat_test/:channelId">
                //         <Chat isLoaded={isLoaded} />
                //     </Route>

                //     <Route path="/reactions">
                //         {/* <ReactionTestPage /> */}
                //     </Route>
                // </Switch>
                // <LoginFormPage />
                <LoginSignupPage />
            )}
        </>
    );
}

export default App;
