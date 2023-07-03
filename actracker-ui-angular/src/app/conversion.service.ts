import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  constructor() { }

  toDate(time: string): Date | undefined {
    return !!time ? new Date(time) : undefined;
  }
}
