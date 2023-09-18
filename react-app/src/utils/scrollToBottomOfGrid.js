export default function scrollToBottomOfGrid() {
	const element = document.getElementById("grid-content");
	if (element) element.scrollTop = element.scrollHeight;
}
