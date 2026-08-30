import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  templateUrl: './flight-detail.html',
  styleUrls: ['./flight-detail.css']
})
export class FlightDetail {

  private route = inject(ActivatedRoute);

  flightId = '';

  ngOnInit() {
    this.flightId = this.route.snapshot.paramMap.get('id') ?? '';
  }

}