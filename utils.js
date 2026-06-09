/**
 * Converts iso or timestamp to a Date object.
 * @param timestamp The timestamp to convert.
 * @returns The corresponding Date object.
 */
export function toDate(time) {
    if (typeof time === "number") {
        return new Date(time * 1000);
    }
    return new Date(time);
}
