import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {DataService} from './services/data.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private userService: DataService , private router: Router) {

  }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.userService.hasToken()) {
      return this.userService.hasToken();
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
