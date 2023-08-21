import { useState, useEffect } from "react";
import debounce from "../utils/debounce";

export default function useInfiniteScrollingTop(containerRef) {
    const [page, setPage] = useState(1);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;  // Distance from the top of the container to the scrolled content
        const topThreshold = 100;  // Threshold value to determine how close (in pixels) to the top we need to be to trigger loading

        if (scrollTop <= topThreshold) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const debounceTimeLimit = 250;
    const debouncedHandleScroll = debounce(handleScroll, debounceTimeLimit);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", debouncedHandleScroll, { passive: true });
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", debouncedHandleScroll);
            }
        };
    }, [containerRef, debouncedHandleScroll]);

    return [page, setPage];
}
