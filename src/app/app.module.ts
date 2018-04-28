import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule , MatSidenavModule , MatRadioModule , MatChipsModule , MatProgressSpinnerModule , MatCardModule , MatDialogModule, MatButtonModule, MatSnackBarModule, MatExpansionModule, MatMenuModule, MatToolbarModule, NoConflictStyleCompatibilityMode } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AgmCoreModule, AgmDataLayer, DataLayerManager, GoogleMapsAPIWrapper} from '@agm/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { router} from './app.router';
import { HeaderComponent } from './header/header.component';
import { DataService} from './services/data.service';
import { HomeComponent } from './home/home.component';
import { AuthGuard} from './auth.guard';
import { AppBoostrapModule} from './app-bootstrap/app-bootstrap.module';
import { QuillModule } from 'ngx-quill';
import { ImageUploadModule } from 'angular2-image-upload';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { DialogTemplateComponent } from './dialog-template/dialog-template.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { OffersComponent } from './offers/offers.component';
import { AccountComponent } from './account/account.component';
import { HaversineService } from 'ng2-haversine';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NumberOnlyDirective,
    HeaderComponent,
    HomeComponent,
    DialogTemplateComponent,
    OffersComponent
   , AccountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSidenavModule,
    MatRadioModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    NoConflictStyleCompatibilityMode,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    router,
    AppBoostrapModule,
    QuillModule,
    ImageUploadModule.forRoot(),
    NgxGalleryModule,
    Ng2ImgMaxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD3Uag3NhOIlMIwGa-JrCGkBCnwHg2TVAo',
      libraries: ['places', 'geometry']
    })
  ],
  entryComponents: [DialogTemplateComponent],
  providers: [ DataService , AuthGuard , DataLayerManager, GoogleMapsAPIWrapper, AgmDataLayer, HaversineService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
