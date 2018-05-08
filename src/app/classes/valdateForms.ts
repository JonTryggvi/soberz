import { FormControl } from '@angular/forms';

export class ValidateForms {

  static getMobileValidator() {
    return function mobileValidator(control: FormControl): { [s: string]: boolean } {

 
      if (!control.value.match(/^[a-zA-Z0-9\-().\s]{10,15}$/))
      { /// ^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/
        return { invalidPassword: true };
      }

      return null;
    };
  }
  static getPasswordValidator() {
    return function passwordValidator(control: FormControl): { [s: string]: boolean } {
      
      // Write code here..
      if (control.value && !control.value.match(/^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/))
      { /// ^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/
        return { invalidPassword: true };
      }

      return null;
    };
  }
}

