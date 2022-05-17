
export function booleanToNumber(param: boolean): number {
    let number = param === true ? 1 : 0;
    return number;
}
export function numberToBoolean(param: number): boolean {
    let boolean = param === 1 ? true : false;
    return boolean;
}