import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidateForms } from '../../classes/valdateForms';
import { FileUploadService } from '../../file-upload.service';
import { UsersActions } from '../../users.actions';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signinForm: FormGroup;
  selectedValue: string;
  isSponsor: boolean = false;
  sponsorToggleText: String = 'I\'m a sponsor';
  genderTypes;//[{ value: 'male' }, { value: 'female' }, { value: 'other' }];
  valueTel = '';
  fileToUpload: File = null;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    // console.log(this.fileToUpload);
    console.log(files);
    
  }

  uploadFileToActivity(signinForm) {
    // console.log(this.fileToUpload);
    
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
      console.log(data);
      let jUserImg = `{ "imgPath":  "${data.imgPath}", "imgId": "${data.imgId}" }`;
      // let sjUserImg = JSON.parse(jUserImg)
      signinForm.value.userImg = jUserImg;

      this.usersActions.saveUser(signinForm.value);
    }, error => {
      console.log(error);
    });
  }


  isSponsorFunc(toggle: boolean) {
    this.isSponsor = toggle;
    // add action for redux here
    // console.log(this.isSponsor); 
  }
  onSubmit(signinForm) {
    // add action for redux here
    signinForm.isSponsor = this.isSponsor;

    console.log(signinForm.value);
    this.uploadFileToActivity(signinForm);
    
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
    return !this.signinForm.controls.tel.value.includes('+45') ? 'We are only accepting Danish numbers for now please add +45 to your input': '';
  }

  constructor(private fb: FormBuilder, private router: Router, private usersActions: UsersActions, private usersService: UsersService, private fileUploadService: FileUploadService) { }
  
  
  ngOnInit(): void {
    this.usersService.getGender().subscribe(data => { 
      data.sort((a, b) => a.gender_name.localeCompare(b.gender_name));
      data.push(data.splice(data.findIndex(d => d.gender_name == 'Other'), 1)[0]);
      this.genderTypes = data;
      // console.log(this.genderTypes);
    });
    
    
    this.signinForm = this.fb.group({
      userImg: [''],
      isSponsor: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      gender: ['', Validators.required],
      tel: ['+45'],
      email: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([
        Validators.required,
        ValidateForms.getPasswordValidator()
      ])]
    })
  }

}
