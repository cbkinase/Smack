import { useState, useEffect } from "react";
import throttle from "../utils/throttle";

export default function useInfiniteScrollingTop(containerRef) {
    const [page, setPage] = useState(1);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;  // Distance from the top of the container to the scrolled content
        const topThreshold = 250;  // Threshold value to determine how close (in pixels) to the top we need to be to trigger loading

        if (scrollTop <= topThreshold) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const throttledHandleScroll = throttle(handleScroll, 150); // 150ms limit for updating page

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", throttledHandleScroll, { passive: true });
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", throttledHandleScroll);
            }
        };
    }, [containerRef, throttledHandleScroll]);

    return page;
}
