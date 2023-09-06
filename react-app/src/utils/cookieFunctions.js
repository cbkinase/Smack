export function getHasVisited() {
    return document.cookie
            .split("; ")
            .find((row) => row.startsWith("hasVisited"))
            ?.split("=")[1];
}

export function setHasVisited() {
    document.cookie = "hasVisited=true; expires=0";
    return;
}