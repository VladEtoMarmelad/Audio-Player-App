export const secondsToTime = (totalSeconds: number): string => {
  const minutes: number = Math.floor(totalSeconds / 60);
  const seconds: number = totalSeconds % 60;

  const formattedMinutes: string = String(minutes).padStart(2, "0"); // adding zero till length of string !== 2
  const formattedSeconds: string = String(seconds).padStart(2, "0"); // adding zero till length of string !== 2
  return `${formattedMinutes}:${formattedSeconds}`;
}