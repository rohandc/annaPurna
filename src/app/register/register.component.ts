import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] ,
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  passMismatch = '';
  passCount= '';
  isSuccess= false;
  isUserDuplicate= '';
  userList: any;
  options= {
    types: ['geocode'],
    componentRestrictions: { country: 'CA' }
  };



  constructor( private fb: FormBuilder , private dataService: DataService ) {

    this.registerForm = fb.group({
      first_name: ['' , Validators.required],
      last_name: ['', Validators.required],
      user_name: ['', Validators.required],
      passwords: fb.group({
        user_password: ['' , Validators.compose([Validators.required, Validators.minLength(8)])],
        confirm_password: ['' ,  Validators.compose([Validators.required])]
      }),
      address: fb.group({
              street_address: [{value: null, disabled: false}],
              locality: [{value: null, disabled: false}],
              administrative_area_level_1: [{value: null, disabled: false}],
              postal_code: [{value: null, disabled: false}],
              country: [{value: null, disabled: false}],
              lat: [],
              lng: [],
      }),
      email: ['', Validators.compose([Validators.required, Validators.email])],
      contact_no: ['', Validators.compose([ Validators.required]) ]
    });
  }

  ngOnInit() {
    this.dataService.getUsers().subscribe( success => {
      this.userList = success;
    });
    this.registerForm.get('user_name').valueChanges.subscribe( (user_name) => {
      let isDuplicate = null, isRequired = null;
      if (user_name.length <= 0) {
        isRequired = true;
      } else {
        isRequired = null;
      }
      if (this.userList.includes(user_name)) {
        isDuplicate = true;
       }else {
        isDuplicate = null;
       }
      this.registerForm.get('user_name').setErrors({'isDuplicate': isDuplicate, 'isRequired' : isRequired});
    });
    this.registerForm.get(['passwords', 'confirm_password']).valueChanges.subscribe(
      (confirm_password) => {
       if (this.registerForm.get(['passwords', 'user_password']).value !== confirm_password
         && confirm_password != null) {
         this.passMismatch = 'Password and Confirm Passwords do not match ';

       } else {this.passMismatch = ''; }
  });
    this.registerForm.get(['passwords', 'user_password']).valueChanges.subscribe( (user_pass) => { if (user_pass.length < 8) {
            this.passCount = 'minimum  8 characters needed';
          }else {
           this.passCount = '';
          }});
    this.registerForm.get('contact_no').valueChanges.subscribe((contact_no) => {
      if ( contact_no.length === 3) { contact_no = contact_no + '-'; }
      if ( contact_no.length === 7) { contact_no = contact_no + '-'; }
    //  if ( contact_no.length === 10) { console.log(contact_no.split('')); }
    });
  }

  getAddress(place: any) {
    const address = place['formatted_address'].split(',');
    this.registerForm.get(['address', 'street_address']).setValue(address[0]);
    for (let i = 0; i < place.address_components.length; i++) {
      for (let j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] === 'locality') {
          this.registerForm.get(['address', 'locality']).setValue( place.address_components[i].long_name);
        }
        if (place.address_components[i].types[j] === 'administrative_area_level_1') {
          this.registerForm.get(['address', 'administrative_area_level_1']).setValue( place.address_components[i].long_name);
        }
        if (place.address_components[i].types[j] === 'postal_code') {
          this.registerForm.get(['address', 'postal_code']).setValue( place.address_components[i].long_name);

        }
        if (place.address_components[i].types[j] === 'country') {
          this.registerForm.get(['address', 'country']).setValue( place.address_components[i].long_name);
        }
      }
    }
    this.registerForm.get(['address', 'lat']).setValue(place.geometry.location.lat());
    this.registerForm.get(['address', 'lng']).setValue(place.geometry.location.lng());
  }

  clearAddress(place: any ) {
    console.log(place);
    if (place.target.value === '') {
      this.registerForm.get(['address', 'street_address']).setValue(null);
      this.registerForm.get(['address', 'locality']).setValue( null);
      this.registerForm.get(['address', 'state']).setValue( null);
      this.registerForm.get(['address', 'postal_code']).setValue(null);
      this.registerForm.get(['address', 'country']).setValue( null);
    }
  }


  validateUserName(user_name: FormControl) {

        this.dataService.checkUserName().map(
          success => {
             const userList: any = success;
             console.log(user_name.value);
          if (userList.includes(user_name.value)) {
            this.isUserDuplicate = 'Username Exists Please choose another one';
            return {isDuplicate: true};
          }else {
            this.isUserDuplicate = '';
            return null;
              }
           },
          error =>  {
            this.isUserDuplicate = 'Username Exists Please choose another one';
            return {isDuplicate: true};
      });
  // return this.dataService.checkUserName(user_name.value) ? {isDuplicate: true} : null;
  }


   onSubmit(formVal: any) {

   this.dataService.registerUser(formVal).subscribe(  suc => {
       this.isSuccess = true;
     },
     err => {
       this.isSuccess = false;
     });
  }


}
