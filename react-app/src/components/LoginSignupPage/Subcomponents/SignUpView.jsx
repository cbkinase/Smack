import OAuth from "./OAuth";
import OrSeparator from "./OrSeparator";

export default function SignUpView({
	signUpForm,
	handleSubmitSignup,
	setFormType,
	email,
	setEmail,
	first_name,
	setFirstName,
	last_name,
	setLastName,
	username,
	setUsername,
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	errors,
	OAuthLink,
}) {
	return (
		<div ref={signUpForm} style={{ display: "none", marginBottom: "90px" }}>
			<div
				style={{
					textAlign: "center",
					fontSize: "18px",
					color: "#454245",
				}}
			>
				We suggest using the <b> email address you use at work.</b>
			</div>

			{errors.length > 0 && (
				<div
					style={{
						paddingTop: "20px",
						color: "red",
						display: "block",
					}}
				>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</div>
			)}

			<OAuth link={OAuthLink} isSigningUp />
			<OrSeparator />

			<form onSubmit={handleSubmitSignup}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
					}}
				>
					<input
						className="login-input-field"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="name@work-email.com"
						name="email"
						autoComplete="username"
						required
					/>
					<input
						className="login-input-field"
						type="text"
						name="first-name"
						autoComplete="on"
						value={first_name}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder="First Name"
						required
					/>
					<input
						className="login-input-field"
						type="text"
						name="last-name"
						autoComplete="on"
						value={last_name}
						onChange={(e) => setLastName(e.target.value)}
						placeholder="Last Name"
						required
					/>
					<input
						className="login-input-field"
						type="text"
						name="username"
						autoComplete="on"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Username"
						required
					/>
					<input
						className="login-input-field"
						type="password"
						name="new-password"
						autoComplete="new-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Create Password"
						required
					/>
					<input
						className="login-input-field"
						type="password"
						name="password"
						autoComplete="off"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirm Password"
						required
					/>
					<button className="login-input-submit" type="submit">
						Sign Up
					</button>
				</div>
			</form>

			<OrSeparator />

			<div
				style={{
					textAlign: "center",
					fontSize: "18px",
					color: "#454245",
				}}
			>
				Already a member?&nbsp;&nbsp;&nbsp;<b>Sign in!</b>
				<br />
				<button
					className="create-account"
					onClick={() => {
						setFormType("login");
					}}
				>
					Member sign in
				</button>
			</div>
		</div>
	);
}
