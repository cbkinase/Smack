export default function LoginView({
    signInForm, errors, handleSubmitLogin,
    email, setEmail, password, setPassword,
    handleDemo, setFormType
     }) {
    return (
        <div ref={signInForm} style={{ display: 'block', marginBottom: '90px' }}>

            <div style={{
                textAlign: 'center', fontSize: '18px', color: '#454245'
            }}>
                Already a member?&nbsp;&nbsp;&nbsp;<b>Sign in below</b>.
            </div >

            {errors.length > 0 &&
                <div style={{ paddingTop: '20px', color: 'red', display: 'block' }}>
                    <li>The provided credentials were invalid.</li>
                </div >
            }

            <form onSubmit={handleSubmitLogin}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '26px' }}>

                    <input
                        className="login-input-field"
                        type="email"
                        name="email"
                        autoComplete="username"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    <input
                        className="login-input-field"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)} required />
                    <button className="login-input-submit" type="submit">Sign In</button>

                </div>


                <div style={{ textAlign: 'center' }}>
                    <button className="demo-user" onClick={async () => { handleDemo() }} type="submit"> Demo User</button>
                </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0px' }}>
                < div style={{
                    height: '1px', width: '100%', backgroundColor: '#dddddd'
                }}></div>
                < div style={{
                    padding: '0px 20px'
                }}>OR</div>
                <div style={{
                    height: '1px', width: '100%', backgroundColor: '#dddddd'
                }}></div>
            </div >

            <div style={{ textAlign: 'center', fontSize: '18px', color: '#454245' }}>
                Ready to talk some smack?&nbsp;&nbsp;&nbsp;<b>Sign up now!</b><br />
                <button className="create-account" onClick={() => { setFormType('signup') }}>Create an account</button>
            </div>

        </div>
    )
}
