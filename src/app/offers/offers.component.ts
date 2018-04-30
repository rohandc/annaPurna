import {Component, OnInit, Input, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { DataService } from '../services/data.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  private _ingredientOffers = new BehaviorSubject<Array<string>>([]);
  @Input()
  set ingredientOffers(value) {
    this._ingredientOffers.next(value);
  }
  get ingredientOffers() {
    return this._ingredientOffers.getValue();
  }

  nfOffers = null;
  fbOffers = null;
  constructor(private dataservice: DataService) {
  }

  ngOnInit() {
    if (this._ingredientOffers.getValue()) {
      this._ingredientOffers
        .subscribe(x => {
          this.dataservice.getmatchedfbOffers(x).subscribe(
            fbObj => {
              this.fbOffers = fbObj; console.log(fbObj);
            });
          this.dataservice.getmatchednfOffers(x).subscribe(
            nfObj => {
              this.nfOffers = nfObj; console.log(nfObj);
            });
        });
    }
  }

/*  ngOnChanges(changes: SimpleChanges) {
    if (changes['ingredientOffers'].currentValue) {
      //this.nfOffers = this.dataservice.getnfOffers();
      console.log(changes['ingredientOffers'].currentValue);
      this.fbOffers = this.dataservice.getmatchedfbOffers(changes['ingredientOffers'].currentValue);
    }

  }*/

  removeNumber(someString) {
   return someString.replace(/[0-9]/g, '');
  }

}
