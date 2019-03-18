import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'VendorName' })
export class SearchExpVendorsPipe implements PipeTransform {
  transform(arrcomplete: any, searchExVendText: any): any {
    if(searchExVendText == null) return arrcomplete;

    return arrcomplete.filter(function(VendorNames){
      return VendorNames.vendor_name.toLowerCase().indexOf(searchExVendText.toLowerCase()) > -1;
    })
  }
}