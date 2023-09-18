import React, { useState, useEffect, useRef } from "react";
import { login, signUp } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, NavLink } from "react-router-dom";
import signinupLogo from './smack-logo-black.svg';
import { deleteCookie, setCookie } from "../../utils/cookieFunctions";
import Footer from "./Subcomponents/Footer";
import LoginView from "./Subcomponents/LoginView";
import SignUpView from "./Subcomponents/SignUpView";

function LoginSignupPage({ setHasVisited }) {
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

    const [formType, setFormType] = useState('login');

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

        if (formType === 'login') {
            signIn.style.display = "block";
            signUp.style.display = "none";
            titleText.innerText = "Sign in to Smack";
        } else {
            signIn.style.display = "none";
            signUp.style.display = "block";
            titleText.innerText = "Sign up for Smack";
        }

    }, [formType])

    if (sessionUser) return <Navigate to="/" />;

    const handleDemo = () => {
        setEmail('demo@aa.io');
        setPassword('verysecurepassword??xd');
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        const data = await dispatch(login(email, password));
        if (data) {
            setErrors([data]);
            return
        }
        setHasVisited(true);
        setCookie("hasVisited", "true");
        navigate("/channels/explore");
    };

    const handleSubmitSignup = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            const data = await dispatch(signUp(username, email, password, first_name, last_name));
            if (data) {
                setErrors(data);
                return
            }
        } else {
            setErrors(['Password does not match confirmation password.']);
            return
        }
        setHasVisited(true);
        setCookie("hasVisited", "true");
        navigate("/channels/explore");
    };

    const handleLogoClick = (e) => {
        deleteCookie("hasVisited");
        setHasVisited(false);
    }

    return (
        <>
            <div className="login-signup" style={{ height: '100%' }}>

                <div style={{ textAlign: 'center' }}>
                    <NavLink onClick={handleLogoClick} to="/">
                        <img src={`${signinupLogo}`} alt="Smack" style={{ width: '145px ' }} />
                    </NavLink>
                </div>

                <div ref={formTitle}
                    style={{ textAlign: 'center', fontSize: '48px', fontWeight: '700', paddingTop: '30px', paddingBottom: '14px' }}>
                    Sign in to Smack
                </div >

                <LoginView
                    signInForm={signInForm}
                    errors={errors}
                    handleSubmitLogin={handleSubmitLogin}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    handleDemo={handleDemo}
                    setFormType={setFormType} />

                <SignUpView
                    signUpForm={signUpForm}
                    handleSubmitSignup={handleSubmitSignup}
                    setFormType={setFormType}
                    email={email} setEmail={setEmail}
                    first_name={first_name} setFirstName={setFirstName}
                    last_name={last_name} setLastName={setLastName}
                    username={username} setUsername={setUsername}
                    password={password} setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    errors={errors}
                 />
            </div >

            <Footer />
        </>
    );
}

export default LoginSignupPage;
