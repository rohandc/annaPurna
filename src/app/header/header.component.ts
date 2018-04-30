import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  protected userInstance = null;
  isUserLoggedIn = this.data.isUserLoggedIn();

  constructor(private data: DataService , private router: Router) {
    this.isUserLoggedIn.subscribe( res => {
      if (this.data.hasToken()) {
        this.userInstance = this.data.getUserDetails();
      }
    });
  }

  ngOnInit() {

  }

  onLogout() {
    if (this.data.logout()) {
      this.router.navigateByUrl('/login');
    }else {
      return null;
    }
  }
}
