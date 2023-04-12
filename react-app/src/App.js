import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authenticate } from "./store/session";
import { useSelector } from 'react-redux';
import LoginSignupPage from "./components/LoginSignupPage";
import ProfileButton from './components/Navigation/ProfileButton';
// import Chat from "./components/ChatTest";
// import ReactionTestPage from "./components/ReactionTest";

function App() {

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const sessionUser = useSelector(state => state.session.user);

  return (
    <>

      {sessionUser ? (
        <ProfileButton user={sessionUser} />
      ) : (
        <LoginSignupPage />
      )}

    </>
  );
}

export default App;
