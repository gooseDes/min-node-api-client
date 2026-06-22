/**
 * Converts iso or timestamp to a Date object.
 * @param timestamp The timestamp to convert.
 * @returns The corresponding Date object.
 */
export declare function toDate(time: string | number): Date;
/**
 * Converts a Date object to a localized string representation.
 * @param date The date to convert.
 * @param format The locale format to use.
 * @param force24Hour Whether to force 24-hour time format.
 * @returns The localized string representation of the date.
 */
export declare function dateToString(date: Date, format: Intl.LocalesArgument, force24Hour: boolean): string;
