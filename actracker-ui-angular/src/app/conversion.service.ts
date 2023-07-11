import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  constructor() { }

  toDate(time: string): Date | undefined {
    return !!time ? new Date(time) : undefined;
  }

  toNumber(value: string): number | undefined {
    return !isNaN(+value) && !isNaN(parseFloat(value)) ? +value : undefined;
  }
}
