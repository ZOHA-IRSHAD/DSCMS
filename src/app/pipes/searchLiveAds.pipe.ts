import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'AdsName' })
export class searchLiveAds implements PipeTransform {
  transform(arrAdvertLive: any, searchLiveAdsText: any): any {
    if(searchLiveAdsText == null) return arrAdvertLive;

    return arrAdvertLive.filter(function(AdsNames){
      return AdsNames.ad_name.toLowerCase().indexOf(searchLiveAdsText.toLowerCase()) > -1;
    })
  }
}