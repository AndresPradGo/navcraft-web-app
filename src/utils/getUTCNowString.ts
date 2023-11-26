

function getUTCNowString(tomorrow?: boolean, formDate?:boolean): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(now.getUTCDate() + (tomorrow ? 1 : 0)).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}${formDate ? "" : ":" + seconds + "Z"}`;
  }
  
  export default getUTCNowString