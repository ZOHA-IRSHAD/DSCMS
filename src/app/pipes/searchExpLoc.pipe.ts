import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'LocationName' })
export class SearchExpLocPipe implements PipeTransform {
  transform(arrLocExpired: any, searchExLocText: any): any {
    
    if(searchExLocText == null) return arrLocExpired;

    return arrLocExpired.filter(function(LocationNames){
      return LocationNames.location_name.toLowerCase().indexOf(searchExLocText.toLowerCase()) > -1;
    })
  }
}