const formatUTCDate = (
  dateString: string | Date,
  monthNameFormat?: boolean,
  elapsedMinutes?: number,
): string => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const originalDate = new Date(dateString);
  const totalMinutes =
    originalDate.getTime() + (elapsedMinutes ? elapsedMinutes : 0) * 60000;
  const date = new Date(totalMinutes);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const monthName = monthNames[date.getMonth()];

  if (monthNameFormat) return `${monthName} ${day}, ${year}`;
  return `${year}/${month < 10 ? '0' : ''}${month + 1}/${day < 10 ? '0' : ''}${day}`;
};

export default formatUTCDate;
