import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { User } from '../../classes/user';

@Pipe({
  name: 'filterUsers'
})
@Injectable()  
export class FilterUsersPipe implements PipeTransform {
  filterByUserType(x) {
    let type: string;
    switch (x.sponsor) {
      case 1:
        type = ' sponsor '
        break;
      case 0:
        type = ' sponsee '
      break  
      default:
        break;
    }
    return type;
  }
  transform(items: User[], args?: any): any {
    
    let userType: String;
    if (args && items.length > 0) {
     
      let itemsFound = items.filter(item => {
        return item.firstname && item.firstname.toLowerCase().includes(args.toLowerCase())
          || this.filterByUserType(item).includes(args.toLowerCase())   
          || this.filterByUserType(item).includes(args.toLowerCase()) && item.firstname.toLowerCase().includes(args.toLowerCase())
        }
      );
      
      if (itemsFound && itemsFound.length > 0) {
        return itemsFound;
      }
      return [-1];
    }
    return items;
  }

}
