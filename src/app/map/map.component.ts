import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataGetService } from '../shared/data-get.service';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public map :  L.Map;
  mapOptions: L.MapOptions;
  markers = [];

  constructor(private dataGetService: DataGetService) {
  }

  ngOnInit(): void {
    this.initMap();
    console.log('executed');
    this.dataGetService.dataReady.subscribe(
      value => {
        console.log(value);
        if (value == true){
          this.updateMap();
        }
    })
  }
  // renderEvent(){
  //   return 
  //   <mat-card class="example-card">
  //       <mat-card-title>{{event.event_name}}
  //         <br>
  //         {{event.time.toDate() | date}}
  //         <br>
  //         {{event.address}}
  //       </mat-card-title>
  //       <mat-card-subtitle>{{event.event_description}}</mat-card-subtitle>
  //       <mat-card-content style = "text-align: center">
  //         <b> Attendees: </b>
  //         <a *ngFor='let attendee of event.attendees' style = "text-align: center">
  //             {{attendee}},
  //         </a>
  //       </mat-card-content>
  //       <mat-card-actions>
  //         <button mat-raised-button (click) = "openJoinDialog(event.event_id)">JOIN</button>
  //       </mat-card-actions>
  //     </mat-card>;
  // }
  updateMap(): void{
    this.markers.forEach(i => {
      this.map.removeLayer(i)
    });
    this.markers = [];
    console.log(this.dataGetService.data);
    for (const c of this.dataGetService.data['venues']){
      const loc = c['location']
      var lat = loc['lat']; var lon = loc['lng'];
      const marker = L.marker([loc['lat'],loc['lng']]).addTo(this.map).bindPopup('<b>'+c.name+'</b><br>' + c.location.formattedAddress.join());
      this.markers.push(marker);
    }
    for (const a of this.dataGetService.list_results){
      const marker = L.marker([a.coord_lat,a.coord_lon]).addTo(this.map).bindPopup('<b>'+a.event_name+'</b><br>'+a.event_description+'<br>'
        +'Time: ' + a.time + '<br>' + a.address + '<br><br>' + 'Attendees: ' + a.attendees + '<br>' + 'Category: ' + a.category);
    }
    this.map.flyTo([this.dataGetService.data.geocode.feature.geometry.center.lat,
        this.dataGetService.data.geocode.feature.geometry.center.lng],12)
  }
  private initMap(): void {
    this.map = L.map('map').setView([42.2808, -83.7430], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }
}