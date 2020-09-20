import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DataGetService } from '../shared/data-get.service';
import { MapComponent } from '../map/map.component';
import { IEvent } from '../interfaces/event'        // Hello, Good Sir
// I'm editing the service.ts file m8

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  constructor(private dataGetService: DataGetService) { }

  ngOnInit() {
    this.dataGetService.getCategories();

    var data_input : IEvent = {
      event_name: 'Recretional Outing',
      event_description: 'For Eric\'s Birthday',
      time: new Date(),
      category: this.dataGetService.category,
      attendees: ['Eric', 'Sky', 'Solomon', 'Alex'],
      coord_lat: 42.296650,
      coord_lon: -83.721287
    };

    // this.dataGetService.createEvent(data_input);

    var hello = this.dataGetService.getEvents();
    console.log(hello);
  }
}
