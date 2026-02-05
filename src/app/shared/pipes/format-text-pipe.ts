import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTextSlice',
})
export class FormatTextPipe implements PipeTransform {

  transform(value: string, sliceCount: number): string {
    if(value.length > sliceCount){
      return value.slice(0, sliceCount) + '...';
    }
    return value;
  }

}
