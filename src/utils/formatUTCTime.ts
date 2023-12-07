
const formatUTCTime = (dateString: string): string => {

    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}Z`

}

export default formatUTCTime