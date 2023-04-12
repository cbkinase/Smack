import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Header from "./components/Shell/Header";
import Shell from "./components/Shell";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      { 
        (sessionUser ? 
        (
          < Shell isLoaded={isLoaded} />
        ):
        (
          <LoginFormPage />
          // <LoginSignupPage />
        ))
        
      }
    </>

    // <div id="grid-container" class="grid-container-hiderightside">
    //   <Header isLoaded={isLoaded} />

    //   {isLoaded && (
    //     <Switch>
    //       <Route path="/login" >
    //         <LoginFormPage />
    //       </Route>
    //       <Route path="/signup">
    //         <SignupFormPage />
    //       </Route>
    //       <Route path="/channel">
    //         <Content />
    //       </Route>
    //       <Route path="/reactions">
    //         <ReactionTestPage />
    //       </Route>
    //       <Route path="/chat_test/:channelId">
    //         <Chat />
    //       </Route>
    //     </Switch>
    //   )}
    // </div>
  );
}

export default App;
