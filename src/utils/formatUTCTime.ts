const formatUTCTime = (
  dateString: string | Date,
  elapsedMinutes?: number,
): string => {
  const originalDate = new Date(dateString);
  const totalMinutes =
    originalDate.getTime() + (elapsedMinutes ? elapsedMinutes : 0) * 60000;
  const date = new Date(totalMinutes);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}Z`;
};

export default formatUTCTime;
