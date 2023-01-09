import { formatDate } from "@angular/common";

export function booleanToNumber(param: boolean): number {
    let number = param === true ? 1 : 0;
    return number;
}
export function numberToBoolean(param: number): boolean {
    let boolean = param === 1 ? true : false;
    return boolean;
}

export function dateToStr(date: Date): string {
    return formatDate( new Date(date).toISOString(),'shortDate','pt-BR','GMT-0');
}

export function strToDate(dateStr: string): Date {
    let dateSplit: string[] = dateStr.split("/");
    return new Date(Number(dateSplit[2]), Number(dateSplit[1])-1, Number(dateSplit[0]));
}