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
    if(this.dataGetService.data){
      this.updateMap();
    }
  }
  updateMap(): void{
    this.markers.forEach(i => {
      this.map.removeLayer(i)
    });
    this.markers = [];
    for (const c of this.dataGetService.data['venues']){
      const loc = c['location']
      const marker = L.marker([loc['lng'], loc['lat']]).addTo(this.map);
      this.markers.push(marker);
    }
  }
  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }
}