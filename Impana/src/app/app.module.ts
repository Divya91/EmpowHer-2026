import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';     
import { provideHttpClient } from '@angular/common/http'; 
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { Login } from './auth/login/login';
import { FlightSearch } from './flight-search/flight-search';
import { Welcome } from './welcome/welcome';
import { FlightDetail } from './flight-detail/flight-detail';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    // Leave empty: Standalone components cannot be declared here.
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes),
    
    // All Standalone components go into the imports array
    AppComponent,
    Login,
    FlightSearch,
    Welcome,
    FlightDetail 
  ],
  providers: [
    provideHttpClient() 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }