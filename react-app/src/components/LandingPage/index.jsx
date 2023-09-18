import Nav from "./Nav/Nav";
import SectionOne from "./Section1/SectionOne";
import Authors from "./Authors/Authors";

export default function LandingPage () {
	return (
		<div className="landing-background">
			<Nav />
			<SectionOne />
			<Authors />

		</div>
	);
}
