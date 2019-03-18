
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'VendorName' })
export class searchLiveVendpipes implements PipeTransform {
  transform(arrLive: any, searchLiveVendorText: any): any {
    if(searchLiveVendorText == null) return arrLive;

    return arrLive.filter(function(VendorNames){
      return VendorNames.vendor_name.toLowerCase().indexOf(searchLiveVendorText.toLowerCase()) > -1;
    })
  }
}