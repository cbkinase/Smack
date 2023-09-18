export function getCookie(key) {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith(key))
		?.split("=")[1];
}

export function setCookie(key, value, expiryDays) {
	let expiration = 0;
	if (expiryDays) {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + expiryDays);
		expiration = expirationDate.toUTCString();
	}
	document.cookie = `${key}=${value}; expires=${expiration}; path=/; SameSite=Lax`;
}

export function deleteCookie(key) {
	document.cookie = `${key}=; expires=${new Date(
		0,
	).toUTCString()}; max-age=0;`;
}
