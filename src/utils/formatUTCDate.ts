
const formatUTCDate = (dateString: string, monthNameFormat?: boolean): string => {

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

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthName = monthNames[date.getMonth()];

    if(monthNameFormat) return `${monthName} ${day}, ${year} UTC`
    return `${year}/${month < 10 ? "0" : ""}${month}/${day < 10 ? "0" : ""}${day}z`

}

export default formatUTCDate