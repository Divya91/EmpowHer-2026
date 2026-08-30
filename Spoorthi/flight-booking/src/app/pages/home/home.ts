import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  searchQuery = {
    fromAirport: '',
    toAirport: '',
    departureDate: '',
    passengers: 1
  };

  constructor(private router:Router){}

  onSearch():void{
    if(this.searchQuery.fromAirport && this.searchQuery.toAirport){
      this.router.navigate(['/search'],{
        queryParams: this.searchQuery
      });
    }
  }
}
