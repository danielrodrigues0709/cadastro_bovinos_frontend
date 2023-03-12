import { formatDate } from "@angular/common";
import { FormGroup } from "@angular/forms";

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

export function validateFormFields(form: FormGroup): void {
    Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        control?.markAsDirty();
        control?.markAsTouched();
    });
}

export function snakeCase(string: string): string {
    return string.replace(/\d+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
};

export function findSpecialCharacters(string: string): boolean {
    const regex = /\W|\0/;
    return regex.test(string);
};