import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-filters.component.html',
  styleUrl: './flight-filters.component.css',
})
export class FlightFiltersComponent {
  @Output()
  filterChanged = new EventEmitter<any>();

  filters = {
    airline: '',

    maxPrice: '',

    sortBy: 'priceLow',
  };

  applyFilters() {
    this.filterChanged.emit(this.filters);
  }
}
