export default function formatLongDate(d, excludeHours) {
    const date = new Date(d);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const longMonths = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();

    // Determine the suffix
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) {
        suffix = 'st';
    } else if (day % 10 === 2 && day !== 12) {
        suffix = 'nd';
    } else if (day % 10 === 3 && day !== 13) {
        suffix = 'rd';
    }

    if (excludeHours) {
        return `${longMonths[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`
    }

    // Construct formatted string
    return `${months[date.getMonth()]} ${day}${suffix} at ` +
           `${String(date.getHours()).padStart(2, '0')}:` +
           `${String(date.getMinutes()).padStart(2, '0')}:` +
           `${String(date.getSeconds()).padStart(2, '0')}`;
}
