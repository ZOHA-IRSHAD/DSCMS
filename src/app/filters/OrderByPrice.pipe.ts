import { Pipe, PipeTransform } from '@angular/core';

@Pipe({  name: 'orderBy' })

export class OrderByPricePipe implements PipeTransform {

//Function to sort items by price(low to high/high to low)
    transform(menus: Array<any>, args?: any): any {
        
        return menus.sort(function(a, b){
            if(a[args.property] < b[args.property]){
                return -1 * args.direction;;
            }
            else if( a[args.property] > b[args.property]){
                return 1 * args.direction;;
            }
            else{
                return 0;
            }
        });
    };
}