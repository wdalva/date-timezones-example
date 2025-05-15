import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { httpAction } from "./_generated/server";

type NotificationWindow = {
  from: string;
  to: string;
};

export const processDates = httpAction(async (ctx, request) => {
  const params = await request.json();
  console.log("params", params);
  const {
    timeZone,
    inputDate,
    notificationWindow,
  }: {
    timeZone: string;
    inputDate: string;
    notificationWindow: NotificationWindow;
  } = params;

  const now = inputDate ? new Date(inputDate) : new Date();
  const zonedDate = toZonedTime(now, timeZone);

  console.log("zonedDate", zonedDate);

  //const dayOfWeek = zonedDate.getDay();
  //if(!weeksToDays.includes(dayOfWeek.toString())) return;

  const timeToSendNotificationUtc = getRandomTimeInRange(
    zonedDate,
    notificationWindow,
    timeZone,
  );

  console.log("timeToSendNotificationUtc", timeToSendNotificationUtc);

  const timeToSendReminderUtc = new Date(timeToSendNotificationUtc);
  timeToSendReminderUtc.setMinutes(timeToSendReminderUtc.getMinutes() + 75);

  console.log("timeToSendReminderUtc", timeToSendReminderUtc);

  const response = {
    timeToSendNotificationUtc: timeToSendNotificationUtc.toISOString(),
    timeToSendReminderUtc: timeToSendReminderUtc.toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

function getRandomTimeInRange(
  date: Date,
  notificationWindow: NotificationWindow,
  timeZone: string,
) {
  // Extract hours and minutes from the UTC from/to values
  const fromDate = new Date(notificationWindow.from);
  const toDate = new Date(notificationWindow.to);

  const fromHours = fromDate.getUTCHours();
  const fromMinutes = fromDate.getUTCMinutes();

  const toHours = toDate.getUTCHours();
  const toMinutes = toDate.getUTCMinutes();

  // Extract the year/month/day from the timezoned date
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Create startTime and endTime in the local timezone
  const startTimeZoned = new Date(
    Date.UTC(year, month, day, fromHours, fromMinutes),
  );
  const endTimeZoned = new Date(Date.UTC(year, month, day, toHours, toMinutes));

  const startTimeUtc = fromZonedTime(startTimeZoned, timeZone);
  const endTimeUtc = fromZonedTime(endTimeZoned, timeZone);

  // Calculate a random time between startTime and endTime
  const randomTimestamp =
    startTimeUtc.getTime() +
    Math.random() * (endTimeUtc.getTime() - startTimeUtc.getTime());

  return new Date(randomTimestamp);
}
