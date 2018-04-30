import {Component, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../services/data.service';
import {MapsAPILoader, GoogleMapsAPIWrapper} from '@agm/core';
import {} from '@types/googlemaps';
import { HaversineService } from 'ng2-haversine';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  passMismatch = '';
  passCount= '';
  isSuccess= false;
  isUserDuplicate= '';
  userList: any;
  options= {
    types: ['geocode'],
    componentRestrictions: { country: 'CA' }
  };
  lat: number;
  lng: number;
  storeArr= [];
  isSet$ = new BehaviorSubject(true);
  userGeoJson= new BehaviorSubject(null);
  userGeoJsonList= new BehaviorSubject(null);
  zoom = 10;
  nfGeoJson = null;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  @ViewChild('map')
  public mapElementRef: ElementRef;
  MAPRADIUS = 9000; //Distance in meters to limit the shops



  constructor( private fb: FormBuilder , private dataService: DataService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone , private mapsAPIWrapper: GoogleMapsAPIWrapper, private _haversineService: HaversineService) {
    this.accountForm = fb.group({
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
        country: [{value: null, disabled: false}]
      }),
      email: ['', Validators.compose([Validators.required, Validators.email])],
      contact_no: ['', Validators.compose([ Validators.required]) ],
      nfAddress:  fb.group({
        storeName: [''],
        storeAddress: [''],
        storeID: [''],
        lat: [''],
        lng: [''],
        isSet: null
      }),
      fbAddress:  fb.group({
        storeName: [''],
        storeAddress: [''],
        storeID: [''],
        lat: [''],
        lng: [''],
        isSet: null
      })
    });
  }

  ngOnInit() {
    this.dataService.getUsers().subscribe( success => {
      this.userList = success;
    });
    const userDetails = this.dataService.getUserDetails();
    this.lat =  Number(userDetails.address.lat);
    this.lng = Number(userDetails.address.lng);
    console.log(userDetails.nfAddress.isSet);
    this.isSet$.next(userDetails.nfAddress.isSet);
    this.searchElementRef.nativeElement.value = userDetails.address['street_address'] + ',' + userDetails.address['locality'] + ',' + userDetails.address['administrative_area_level_1'] + ',' + userDetails.address['country'] + ',' + userDetails.address['postal_code'];
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      this.dataService.getnfAllLocations().subscribe(result => {
        this.nfGeoJson = this.processMarker(result);
        // this.userGeoJson.next(this.processMarker(result));
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.getAddress(place);
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
    this.accountForm.controls['user_name'].setValue(userDetails.user_name);
    this.accountForm.controls['first_name'].setValue(userDetails.first_name);
    this.accountForm.controls['last_name'].setValue(userDetails.last_name);
    this.accountForm.controls['passwords'].patchValue({user_password: userDetails.user_password});
    this.accountForm.controls['address'].patchValue(userDetails.address);


    this.accountForm.get('user_name').valueChanges.subscribe( (user_name) => {
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
      this.accountForm.get('user_name').setErrors({'isDuplicate': isDuplicate, 'isRequired' : isRequired});
    });
    this.accountForm.get(['passwords', 'confirm_password']).valueChanges.subscribe(
      (confirm_password) => {
        if (this.accountForm.get(['passwords', 'user_password']).value !== confirm_password
          && confirm_password != null) {
          this.passMismatch = 'Password and Confirm Passwords do not match ';

        } else {this.passMismatch = ''; }
      });
    this.accountForm.get(['passwords', 'user_password']).valueChanges.subscribe( (user_pass) => { if (user_pass.length < 8) {
      this.passCount = 'minimum  8 characters needed';
    }else {
      this.passCount = '';
    }});
    this.accountForm.get('contact_no').valueChanges.subscribe((contact_no) => {
      if ( contact_no.length === 3) { contact_no = contact_no + '-'; }
      if ( contact_no.length === 7) { contact_no = contact_no + '-'; }
      //  if ( contact_no.length === 10) { console.log(contact_no.split('')); }
    });

  }

  get storeName(){
    return this.accountForm.get(['nfAddress', 'storeName']).value;
  }
  get storeAddress(){
    return this.accountForm.get(['nfAddress', 'storeAddress']).value;
  }
  get storeID(){
    return this.accountForm.get(['nfAddress', 'storeID']).value;
  }

  setStore() {
    if (this.storeName != null ) {
      const temp_lat = this.accountForm.get(['nfAddress', 'lat']).value;
      const temp_lng = this.accountForm.get(['nfAddress', 'lng']).value;
      /*const tempVal = this.nfGeoJson.features.filter((geoObj) => {
        if (temp_lat === geoObj.geometry.coordinates[1] && temp_lng.toFixed(5) === geoObj.geometry.coordinates[0].toFixed(5)) {
          this.isSet$.next(true);
          this.nfGeoJson = null;
          geoObj.code = 'NF';
          return geoObj;
        }});*/
      //this.userGeoJson.next({features: tempVal , type: 'FeatureCollection' }) ;
      this.isSet$.next(true);
      this.userGeoJson.next([{lat: temp_lat, lng: temp_lng}]);
    }
  }

  changeStore(code) {

      const test = this.userGeoJson.getValue();
      const tempval = test.features.filter(obj => obj.code !== code);
      this.userGeoJson.next(null);
      test.features = tempval;
      this.userGeoJson.next(test);
      console.log(this.userGeoJson);
      // const tempVal$ = this.userGeoJson.asObservable();
      // tempVal$.subscribe((featureCollection) => {
      //   featureCollection.features.forEach((currentValue, index, array) => {
      //     if (currentValue.code === code) {
      //       array.splice(index, 1);
      //     }
      //   });
      //   //featureVal = featureCollection;
      //   this.userGeoJson.next(featureCollection);
      //   this.userGeoJson.complete();
      // });

    //this.isSet$.next(false);
    /*this.dataService.getnfAllLocations().subscribe(result => {
      this.nfGeoJson = this.processMarker(result);
      //this.userGeoJson.next(this.processMarker(result));
    });*/
  }

  getAddress(place: any) {
    const address = place['formatted_address'].split(',');
    this.accountForm.get(['address', 'street_address']).setValue(address[0]);
    for (let i = 0; i < place.address_components.length; i++) {
      for (let j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] === 'locality') {
          this.accountForm.get(['address', 'locality']).setValue( place.address_components[i].long_name);
        }
        if (place.address_components[i].types[j] === 'administrative_area_level_1') {
          this.accountForm.get(['address', 'administrative_area_level_1']).setValue( place.address_components[i].short_name);
        }
        if (place.address_components[i].types[j] === 'postal_code') {
          this.accountForm.get(['address', 'postal_code']).setValue( place.address_components[i].long_name);

        }
        if (place.address_components[i].types[j] === 'country') {
          this.accountForm.get(['address', 'country']).setValue( place.address_components[i].long_name);
        }
      }
    }
    this.dataService.getnfAllLocations().subscribe(result => {
      this.nfGeoJson = this.processMarker(result);
      this.userGeoJson.next(this.processMarker(result));
    });
  }

  clearAddress(place: any ) {
    console.log(place);
    if (place.target.value === '') {
      this.accountForm.get(['address', 'street_address']).setValue(null);
      this.accountForm.get(['address', 'locality']).setValue( null);
      this.accountForm.get(['address', 'state']).setValue( null);
      this.accountForm.get(['address', 'postal_code']).setValue(null);
      this.accountForm.get(['address', 'country']).setValue( null);
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

  processMarker(jsonData) {
    const tempArr = jsonData.features.filter((geoObj) => {
      const destination = {latitude: geoObj.geometry.coordinates[1], longitude: geoObj.geometry.coordinates[0]};
      const source = {latitude: this.lat, longitude: this.lng};
      const distanceInMeter = this._haversineService.getDistanceInMeters(source, destination);
      if (distanceInMeter <= this.MAPRADIUS ) {
        return geoObj;
      }
    });
    jsonData.features = tempArr;
    //console.log(jsonData);
    return jsonData;
  }

  styleFunc() {
    const color = 'green';
    return {
      icon: './assets/images/nfMarker.png',
      fillColor: color,
      strokeColor: color,
      strokeWeight: 1
    };
  }

  styleFunc2() {
    const color = 'purple';
    return {
      icon: './assets/images/store.png',
      fillColor: color,
      strokeColor: color,
      strokeWeight: 1
    };
  }

  markerSelect(event) {
    const latlng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
    this.nfGeoJson.features.filter((geoObj) => {
      if (latlng.lat === geoObj.geometry.coordinates[1]) {
        this.storeArr.push(geoObj);
        this.accountForm.controls['nfAddress'].patchValue({storeAddress: geoObj.properties.details.streetAddress + ',' + geoObj.properties.details.province + ',' + geoObj.properties.details.postalCode });
        this.accountForm.controls['nfAddress'].patchValue({storeName: geoObj.properties.details.storeName});
        this.accountForm.controls['nfAddress'].patchValue({storeID: geoObj.properties.details.storeID});
        this.accountForm.controls['nfAddress'].patchValue({lat: latlng.lat});
        this.accountForm.controls['nfAddress'].patchValue({lng: latlng.lng});
      }});
   /* geocoder.geocode( { 'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
            console.log(results, latlng);
        /!*this.accountForm.controls['nfAddress'].patchValue({street_address:''});
        this.accountForm.controls['nfAddress'].patchValue({locality:''});
        this.accountForm.controls['nfAddress'].patchValue({administrative_area_level_1:''});
        this.accountForm.controls['nfAddress'].patchValue({postal_code:''});
        this.accountForm.controls['nfAddress'].patchValue({country:''});
        this.accountForm.controls['nfAddress'].patchValue({lat:latlng.lat});
        this.accountForm.controls['nfAddress'].patchValue({lng:latlng.lng});*!/
      }
    });*/

  }


}
