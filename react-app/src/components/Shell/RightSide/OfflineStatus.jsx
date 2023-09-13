export default function OfflineStatus() {
    const away = <svg height="20" width="20" viewBox="0 0 20 20">
        <path fill="currentColor" fill-rule="evenodd" d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" clip-rule="evenodd"></path>
        </svg>

    return (
    <span style={{display: "flex"}}>
        <span style={{paddingRight: "5px"}}>{away}</span>
        Away
    </span>)
}
