import OAuth from "./OAuth";
import OrSeparator from "./OrSeparator";

export default function LoginView({
	signInForm,
	errors,
	handleSubmitLogin,
	email,
	setEmail,
	password,
	setPassword,
	handleDemo,
	setFormType,
	OAuthLink,
}) {
	return (
		<div
			ref={signInForm}
			style={{ display: "block", marginBottom: "90px" }}
		>
			<div
				style={{
					textAlign: "center",
					fontSize: "18px",
					color: "#454245",
				}}
			>
				Already a member?&nbsp;&nbsp;&nbsp;<b>Sign in below</b>.
			</div>

			{errors.length > 0 && (
				<div
					style={{
						paddingTop: "20px",
						color: "red",
						display: "block",
					}}
				>
					<li>{errors[0]}</li>
				</div>
			)}
			<OAuth link={OAuthLink} />
			<OrSeparator />

			<form onSubmit={handleSubmitLogin}>
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
						name="email"
						autoComplete="username"
						value={email}
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						className="login-input-field"
						type="password"
						name="password"
						autoComplete="current-password"
						value={password}
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button className="login-input-submit" type="submit">
						Sign In
					</button>
				</div>

				<div style={{ textAlign: "center" }}>
					<button
						className="demo-user"
						onClick={async () => {
							handleDemo();
						}}
						type="submit"
					>
						{" "}
						Demo User
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
				Ready to talk some smack?&nbsp;&nbsp;&nbsp;<b>Sign up now!</b>
				<br />
				<button
					className="create-account"
					onClick={() => {
						setFormType("signup");
					}}
				>
					Create an account
				</button>
			</div>
		</div>
	);
}
