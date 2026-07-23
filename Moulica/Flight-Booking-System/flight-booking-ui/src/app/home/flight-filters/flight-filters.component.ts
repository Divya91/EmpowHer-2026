import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-filters.component.html',
  styleUrl: './flight-filters.component.css',
})
export class FlightFiltersComponent implements OnChanges {
  @Input()
  airlines: any[] = [];

  @Input()
  maxPriceLimit = 1000;

  @Output()
  filterChanged = new EventEmitter<any>();

  filters = {
    airline: '',
    maxPrice: '',
    sortBy: 'priceLow',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxPriceLimit']) {
      this.filters.maxPrice = this.maxPriceLimit;
    }
  }

  applyFilters() {
    this.filterChanged.emit(this.filters);
  }
}
