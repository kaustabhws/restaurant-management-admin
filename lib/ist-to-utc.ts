/**
 * Converts IST time string (HH:MM:SS) to a UTC Date object
 * @param timeStr - The time in HH:MM:SS format (IST)
 * @param baseDate - The date to apply the time on
 * @returns UTC Date object
 */
const convertISTTimeToUTC = (timeStr: string, baseDate: Date) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  
    // Convert IST to UTC (-5 hours 30 mins)
    let utcHours = (hours - 5 + 24) % 24;
    let utcMinutes = (minutes - 30 + 60) % 60;
  
    // Adjust hour when minutes go negative
    if (minutes < 30) {
      utcHours = (utcHours - 1 + 24) % 24;
    }
  
    return new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate(), utcHours, utcMinutes, seconds));
  };
  
  /**
   * Gets the business opening and closing window in UTC
   * @param openingTime - Opening time in HH:MM:SS (IST)
   * @param closingTime - Closing time in HH:MM:SS (IST)
   * @returns An object with { openingUTC, closingUTC }
   */
  export const getBusinessWindow = (openingTime: string, closingTime: string) => {
    const now = new Date();
  
    // Convert to UTC
    let openingUTC = convertISTTimeToUTC(openingTime, now);
    let closingUTC = convertISTTimeToUTC(closingTime, now);
  
    // If closing time is before opening, shift closing time to next day
    if (closingUTC <= openingUTC) {
      closingUTC.setDate(closingUTC.getDate() + 1);
    }
  
    // If current time is before today's opening, shift to the previous day's business hours
    if (now < openingUTC) {
      openingUTC.setDate(openingUTC.getDate() - 1);
      closingUTC.setDate(closingUTC.getDate() - 1);
    }
  
    return { openingUTC, closingUTC };
  };