import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDateObject'
})
export class ConvertStringToDateObjectPipe implements PipeTransform {

  transform(value: string): Date {
    // This pipe is needed because of how Safari stores date in ISO 8601 format
    // https://github.com/angular/angular/issues/12334
    if (this.isValidDate(value)) {
      if (value.indexOf(' ') === -1) {
        value = value + ' 00:00:00';
      }
      return new Date(value.replace(' ', 'T'));
    }
    return null;
  }

  isValidDate(value: string): boolean { 
    return (!isNaN(Date.parse(value)));
  }
}
