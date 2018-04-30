import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {

    this.loginForm = this.fb.group({
      user_name: ['jholllll', Validators.required],
      user_password: ['test12345', Validators.required],
    });


  }


  onSubmit(form) {
    this.loading = true;
    this.dataService.login(form.value).then(success => {
        // HeaderComponent.updateUserStatus.next(true);
        this.router.navigate(['home']);
      },
      error => {
        console.log(error.error);
      });
   }
}
