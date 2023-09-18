export default function throttle(func, limit) {
	// Ensures that a function is not called more than once in a given time limit
	let inThrottle;
	return function () {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
				return undefined;
			}, limit);
		}
	};
}
