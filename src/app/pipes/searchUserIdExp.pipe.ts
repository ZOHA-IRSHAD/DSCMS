import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'UserName' })
export class searchExpUserpipes implements PipeTransform {
  transform(arrUserLive: any, searchExpUserText: any): any {
    if(searchExpUserText == null) return arrUserLive;

    return arrUserLive.filter(function(UserNames){
      return UserNames.user_id.toLowerCase().indexOf(searchExpUserText.toLowerCase()) > -1;
    })
  }
}