
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'UserName' })
export class searchLiveUserpipes implements PipeTransform {
  transform(arrUserLive: any, searchLiveUserText: any): any {
    if(searchLiveUserText == null) return arrUserLive;

    return arrUserLive.filter(function(UserNames){
      return UserNames.user_id.toLowerCase().indexOf(searchLiveUserText.toLowerCase()) > -1;
    })
  }
}