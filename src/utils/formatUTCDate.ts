
const formatUTCDate = (dateString: string, monthNameFormat?: boolean, elapsedMinutes?: number): string => {

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const originalDate = new Date(dateString);
    const totalMinutes = originalDate.getTime() + (elapsedMinutes ? elapsedMinutes : 0) * 60000;
    const date = new Date(totalMinutes);
    const day = date.getUTCDate();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const monthName = monthNames[date.getMonth()];

    if(monthNameFormat) return `${monthName} ${day}, ${year}`
    return `${year}/${month < 10 ? "0" : ""}${month + 1}/${day < 10 ? "0" : ""}${day}`

}

export default formatUTCDate