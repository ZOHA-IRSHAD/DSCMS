import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'AdvertName' })
export class AdvertExpPipe implements PipeTransform {
  transform(arrAdvertExpired: any, searchExAdText: any): any {
    if(searchExAdText == null) return arrAdvertExpired;

    return arrAdvertExpired.filter(function(AdvertNames){
      return AdvertNames.ad_name.toLowerCase().indexOf(searchExAdText.toLowerCase()) > -1;
    })
  }
}