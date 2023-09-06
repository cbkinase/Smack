export function getHasVisitedCookie() {
    return document.cookie
            .split("; ")
            .find((row) => row.startsWith("hasVisited"))
            ?.split("=")[1];
}

export function setHasVisitedCookie() {
    document.cookie = "hasVisited=true; expires=0";
    return;
}