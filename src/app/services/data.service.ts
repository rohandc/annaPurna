import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { UserInterface} from '../interfaces/user.interface';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Ng2ImgMaxService } from 'ng2-img-max';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  private userKey = 'userDetails';
  private tokenKey= 'userToken';
  private user: UserInterface = null;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

      constructor(private _http: HttpClient, private imgMaxService: Ng2ImgMaxService) {
    }

      isUserLoggedIn() {
        return this.isLoginSubject.asObservable();
      }

      handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

      hasToken(): boolean {
          return !(sessionStorage.getItem(this.userKey) === null);
        }

      getUsers() {
      return this._http.get('/user/list')
                 .catch(this.handleError);
      }

      getRecipe() {
        return this._http.get('/user/recipe/list')
          .catch(this.handleError);
      }

      checkUserName() {
      return   this._http.get('/user/list');
      }

      registerUser(user_object) {

      return this._http.post('/user/register', user_object);

    }

      submitRecipe(recipe_object) {
        return this._http.post('/user/recipe/create', recipe_object);

      }

      login(login_object) {
        return new Promise(( resolve, reject) => {
          this._http.post('/user/login', login_object).subscribe(success => {
            this.setUserDetails(success);
            this.isLoginSubject.next(true);
            resolve(this.hasToken);
            },
            error => {
            reject(this.hasToken);
            }); });

        }

      logout() {
        sessionStorage.clear();
        this.isLoginSubject.next(false);
        return (sessionStorage.getItem(this.userKey) === null);
      }

      setUserDetails(userObj) {
      sessionStorage.setItem( this.userKey, JSON.stringify(userObj['user']));
      sessionStorage.setItem(this.tokenKey, JSON.stringify(userObj['token']));
    }

      getUserDetails () {
        return this.sessionToObj({userSessionObj: sessionStorage.getItem(this.userKey)});
      }

      sessionToObj(parameters: { userSessionObj: any }): UserInterface {
        let userSessionObj = parameters.userSessionObj;
        userSessionObj = JSON.parse(userSessionObj);
        this.user = userSessionObj;
        return this.user;
      }

      imageResizer(input: any) {
      let retValue = null;
        if ( input instanceof Array ) {
          retValue = this.imgMaxService.compress(input, 0.1);
        } else {
          retValue = this.imgMaxService.compressImage(input , 0.1);
        }
        return retValue;
      }

      getSingeRecipe(recipeId) {
        return this._http.get(`/user/recipe/${recipeId}`)
          .catch(this.handleError);
      }

      editRecipe(recipeId, formValue) {
        return this._http.post(`/user/recipe/${recipeId}`, formValue)
          .catch(this.handleError);
      }

      deleteRecipe(recipeId) {
        return this._http.delete(`/user/recipe/${recipeId}`)
          .catch(this.handleError);
      }
      //Required Dont Delete
      getfbOffers() {
        return this._http.get('/flyer/fbScrape').catch(this.handleError);
      }
      //Required Dont Delete
      getnfOffers() {
        return this._http.get('/flyer/nfScrape').catch(this.handleError);
      }
      getmatchedfbOffers(inputObj) {
        return this._http.get(`/flyer/fbOffers/${inputObj}`).catch(this.handleError);
      }
      getmatchednfOffers(inputObj) {
        return this._http.get(`/flyer/nfOffers/${inputObj}`).catch(this.handleError);
      }
      getnfAllLocations() {
        return this._http.get('/flyer/nfAllLocations/').catch(this.handleError);
      }
    /*  rad(x) {
        return x * Math.PI / 180;
      }
      getDistance(p1, p2) {
        const R = 6378137; // Earth’s mean radius in meter
        const dLat = this.rad(p2.lat() - p1.lat());
        const dLong = this.rad(p2.lng() - p1.lng());
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // returns the distance in meter
      }*/
   }
