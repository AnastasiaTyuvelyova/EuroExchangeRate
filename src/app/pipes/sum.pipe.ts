import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sum'})
export class SumPipe implements PipeTransform {
  transform(value: number): number {
    return value ? Math.round((value + Number.EPSILON) * 100) / 100 : 0;
  }
}