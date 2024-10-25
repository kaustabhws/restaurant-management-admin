export function getISTTime(utcTime: Date): string {
  // Parse the UTC time to a Date object
  const utcDate = new Date(utcTime);

  // Create an offset for IST (+5 hours 30 minutes)
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

  // Check if the system timezone offset matches IST
  const currentOffset = new Date().getTimezoneOffset();
  const IST_OFFSET_MINUTES = -330; // IST offset in minutes (UTC+5:30)

  // If the system is already in IST, return the input time as is
  if (currentOffset === IST_OFFSET_MINUTES) {
    return utcDate.toISOString();
  }

  // Otherwise, convert to IST by adding the offset
  const istDate = new Date(utcDate.getTime() + IST_OFFSET);

  // Return the IST time in ISO format
  return istDate.toISOString();
}
