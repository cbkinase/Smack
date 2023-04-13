import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Shell from "./components/Shell";
import CreateChannel from "./components/Shell/Content/Channels/ChannelCreator"
import EditChannel2 from "./components/Shell/Content/Channels/ChannelEditor";
import OneChannel from "./components/OneChannel";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      <Switch>
        <Route path='/' exact>
          < Shell isLoaded={isLoaded} />
        </Route>
        <Route path="/create" exact>
          <CreateChannel />
        </Route>
        <Route path="/:channelId" exact>
          <OneChannel />
        </Route>
        <Route path="/:channelId/edit" exact>
          <EditChannel2 />
        </Route>
      </Switch>
    </>
  );
}

export default App;
