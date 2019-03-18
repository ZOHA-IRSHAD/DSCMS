import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'searchBy' })
export class SearchByPipe implements PipeTransform {

//Function to search items from menu
  transform(menus: any, searchText: any): any { 
    // var text = searchText.trim();
    if(searchText == null) return menus;

    return menus.filter(function(menu1){
          return menu1.item_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }
}