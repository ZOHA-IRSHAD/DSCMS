
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'locName' })
export class searchLiveLocpipes implements PipeTransform {
  transform(arrLocLive: any, searchLivelocText: any): any {
    
    if(searchLivelocText === null) return arrLocLive;

    return arrLocLive.filter(function(locNames){
      return locNames.location_name.toLowerCase().indexOf(searchLivelocText.toLowerCase()) > -1;
    })
  }
}