export default function userObjectToNameList(
	obj,
	currUser,
	withoutComma = false,
	nameQtyCutoff = 5,
) {
	/* Takes in an object that looks like
    {"1" :
        {"avatar": "", "first_name": "", "last_name": ""},
    "2" :
        { ... },
    }

    And converts it into a string where the the first and last names of
    all non-self users are comma separated.

    */

	const names = [];

	for (const key in obj) {
		if (key !== currUser.id.toString()) {
			const user = obj[key];
			names.push(`${user.first_name} ${user.last_name}`);

			if (names.length >= nameQtyCutoff) {
				names.push("...");
				break;
			}
		}
	}

	if (names.length === 0) {
		return (
			<>
				{currUser.first_name} {currUser.last_name}&nbsp;&nbsp;&nbsp;
				<span style={{ opacity: "0.7" }}>you</span>
			</>
		);
	}

	return names.join(`${withoutComma ? " " : ", "}`);
}
