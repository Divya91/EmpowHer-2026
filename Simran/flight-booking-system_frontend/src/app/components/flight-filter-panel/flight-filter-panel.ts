import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';


@Component({

  selector: 'app-flight-filter-panel',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './flight-filter-panel.html',

  styleUrl: './flight-filter-panel.css'

})


export class FlightFilterPanel {


  selectedStops = 'all';

  maxPrice = 700;

  departureTime = 'all';


  airlines = [

    {
      name: 'American Airlines',
      checked: false
    },

    {
      name: 'Delta Airlines',
      checked: false
    },

    {
      name: 'United Airlines',
      checked: false
    },

    {
      name: 'SkyFlow Pacific',
      checked: false
    },

    {
      name: 'SkyFlow Atlantic',
      checked: false
    }

  ];


  @Output()
  filterChange =
    new EventEmitter<any>();


  applyFilters(): void {

    this.filterChange.emit({

      stops: this.selectedStops,

      maxPrice: this.maxPrice,

      departureTime: this.departureTime,

      airlines: this.airlines
        .filter(airline => airline.checked)
        .map(airline => airline.name)

    });

  }


  resetFilters(): void {

    this.selectedStops = 'all';

    this.maxPrice = 700;

    this.departureTime = 'all';


    this.airlines.forEach(
      airline => airline.checked = false
    );


    this.applyFilters();

  }

}