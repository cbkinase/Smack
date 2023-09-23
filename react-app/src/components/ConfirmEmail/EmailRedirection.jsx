import gmailPicture from "../../assets/get-started-icon-gmail.png";
import outlookPicture from "../../assets/get-started-icon-outlook.png";

export default function EmailRedirection() {
	return (
		<>
			<div className="email-redirection-container">
				<a
					className="email-redirection-link"
					rel="noreferrer"
					href="https://mail.google.com/mail/u/0/"
					target="_blank"
				>
					<img
						className="email-redirection-logo"
						alt=""
						src={gmailPicture}
					/>
					Open Gmail
				</a>
				<a
					className="email-redirection-link"
					rel="noreferrer"
					href="https://outlook.live.com/mail/0/inbox"
					target="_blank"
				>
					<img
						className="email-redirection-logo"
						alt=""
						src={outlookPicture}
					/>
					Open Outlook
				</a>
			</div>
			<div>
				<p className="email-redirection-note">
					Can’t find your code? Check your spam folder!
				</p>
			</div>
		</>
	);
}
