import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDateObject'
})
export class ConvertDateObjectPipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      if (value.indexOf(' ') === -1) {
        value = value + ' 00:00:00';
      }
      return new Date(value.replace(' ', 'T'));
    }
    return null;
  }
}
