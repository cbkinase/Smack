import { useEffect, useState } from "react";
import debounce from "../utils/debounce";

export default function useViewportWidth () {
	const [viewportWidth, setViewportWidth] = useState(window.visualViewport.width);

	useEffect(() => {
		const debouncedHandleResize = debounce(function handleResize () {
			setViewportWidth(window.visualViewport.width);
		}, 50);

		window.addEventListener("resize", debouncedHandleResize);

		return () => {
			window.removeEventListener("resize", debouncedHandleResize);
		};
	}, []);

	return viewportWidth;
}
