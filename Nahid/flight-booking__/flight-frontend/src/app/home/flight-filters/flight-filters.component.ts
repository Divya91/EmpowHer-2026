import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input()
  airlines: any[] = [];

  @Input()
  maxPriceLimit = 1000;

  @Output()
  filterChanged = new EventEmitter<any>();

  filters = {
    airline: '',
    maxPrice: 1000,
    sortBy: 'priceLow',
  };

  applyFilters() {
    this.filterChanged.emit(this.filters);
  }

  resetFilters() {
    this.filters = {
      airline: '',
      maxPrice: this.maxPriceLimit,
      sortBy: 'priceLow',
    };

    this.applyFilters();
  }
}
