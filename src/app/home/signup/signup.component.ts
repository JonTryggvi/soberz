import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidateForms } from '../../classes/valdateForms';
import { FileUploadService } from '../../file-upload.service';
import { UsersActions } from '../../users.actions';
import { UsersService } from '../../users.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signinForm: FormGroup;
  selectedValue: string;
  isSponsor: boolean = false;
  sponsorToggleText: String = 'I\'m a sponsor';
  genderTypes;//[{ value: 'male' }, { value: 'female' }, { value: 'other' }];
  valueTel = '';
  fileToUpload: File = null;
  apiSubscribe: Subscription;
  validApiNumber: String = '';
  value;
  value2;
  valuePass;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    // console.log(this.fileToUpload);
    // console.log(files);
  }

  uploadFileToActivity(signinForm) {
    // console.log(this.fileToUpload);
    let oldFile = undefined;
    if (this.fileToUpload) {
      this.fileUploadService.postFile(this.fileToUpload, oldFile).subscribe(data => {
        // do something, if upload success
        console.log(data);
        let jUserImg = `{ "imgPath":  "${data.imgPath}", "imgId": "${data.imgId}" }`;
        signinForm.value.userImg = jUserImg;
        this.usersActions.saveUser(signinForm.value);
      }, error => {
        console.log(error);
      });
    } else {
      this.usersActions.saveUser(signinForm.value);
    }
  
  }


  isSponsorFunc(toggle: boolean) {
    this.isSponsor = toggle;
    // add action for redux here
    // console.log(this.isSponsor); 
  }
  

  getErrorMessage() {
    return this.signinForm.controls.email.hasError('required') ? 'You must enter a value' :
      this.signinForm.controls.email.hasError('email') ? 'Not a valid email' :
        '';
  }
  getErrorMessage2() {
    return 'The email you entered does not match the field above';
  }
  getPasswordErrorMessage() {
    return this.signinForm.controls.password.hasError('required') ? 'You must enter a value' : '';
  }
  fixNumber() {
    // this.signinForm.controls.tel.value[0] !== '+' ? this.signinForm.patchValue({ tel: '+45' + this.signinForm.controls.tel.value }): ''; 
    return this.signinForm.controls.tel.hasError('required') ? 'You must enter a valid number' : '';
  }

 

  constructor(private fb: FormBuilder, private router: Router, private usersActions: UsersActions, private usersService: UsersService, private fileUploadService: FileUploadService) { }
  
  checkNumber(number) {
    if (number && number.length >= 6) {
      this.apiSubscribe = this.usersService.getValidMobile(number).subscribe(data => {
        this.validApiNumber = data.international_format;
       
      });
    }
  }

  onSubmit(signinForm) {
    // add action for redux here
    if (signinForm.valid) {

      signinForm.value.tel = this.validApiNumber; // think a little about if the API doesnt awnser
      this.uploadFileToActivity(signinForm);
      this.router.navigate(['/home/login/']);
    }
  
  }

  ngOnInit(): void {
    this.usersService.getGender().subscribe(data => { 
      data.sort((a, b) => a.gender_name.localeCompare(b.gender_name));
      data.push(data.splice(data.findIndex(d => d.gender_name == 'Other'), 1)[0]);
      this.genderTypes = data;
      // console.log(this.genderTypes);
    });
    
    
    this.signinForm = this.fb.group({
      userImg: [''],
      isSponsor: [false, Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      gender: ['', Validators.required],
      tel: [this.validApiNumber, Validators.compose([
        Validators.required,
        ValidateForms.getMobileValidator()
      ])],
      email: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([
        Validators.required,
        ValidateForms.getPasswordValidator()
      ])]
    })
  }
  ngOnDestroy(): void{
    // if (this.apiSubscribe) {
    //   this.apiSubscribe.unsubscribe();
    // }
  }

}
