export function getISTTime(utcTime: Date): string {
  // Parse the UTC time to a Date object
  const utcDate = new Date(utcTime);

  // Create an offset for IST (+5 hours 30 minutes)
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

  // Convert to IST by adding the offset
  const istDate = new Date(utcDate.getTime() + IST_OFFSET);

  // Return the IST time in ISO format
  return istDate.toISOString();
}
