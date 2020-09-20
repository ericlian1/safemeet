import { Injectable,ApplicationRef  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { IEvent, OEvent } from '../interfaces/event';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';
import { MapComponent } from 'app/map/map.component';

@Injectable()
export class DataGetService {
  constructor(private http: HttpClient, private firestore: AngularFirestore,private ref: ApplicationRef) { }

  private eventsReady = false;
  private venuesReady = false;
  dataReady = new BehaviorSubject(this.eventsReady&&this.venuesReady);
  public categories;
  public data;
  //private credentials = 'client_id=QM2U4XNDGAZS2PZUYEH001OCBDBUBXBT1VZT5N4CT1DOI0ZX&client_secret=JFS0JK3BY3KND5OIY3FMEA4P5VP5G3FV31A4THXELDPB0ASA';
  private credentials = 'client_id=T3G1LFSOOT1SLHVM5M0Z5TAORW2G0ZDJRPO0XH4DMZ5CJJD5&client_secret=1CYBI50VHYH313YZUBM41NL2DLESNEJTIXPN5IFDPNGAYAAQ';
  private url = '';
  private location = '';
  private radius = 0;
  public category = 'I\'m looking for...';
  private errorCategory: boolean = false;
  private errorLocation: boolean = false;
  private hasChanges: boolean = false;
  public list_results: Array<OEvent> = [];

  createEvent(data) {
    return new Promise<any>((resolve, reject) =>{
        this.firestore
            .collection("scheduled_events")
            .add(data)
            .then(res => {}, err => reject(err));
    });
  }

  updateEvent(event_id, name) {
    console.log("Updating Event!!")
    console.log("event_id: " + event_id)
    console.log("name: " + name)
    var updated_object;
    for(var i = 0; i < this.list_results.length; ++i) {
      if(this.list_results[i].event_id == event_id) {
        this.list_results[i].attendees.push(name);
        updated_object = this.list_results[i];
      }
    }
    console.log(updated_object)
    this.firestore.collection("scheduled_events").doc(event_id).set(
      {attendees:updated_object.attendees,}, {merge: true}
    );
    this.ref.tick();
  }

  getEvents() { 
    this.firestore.collection("scheduled_events").get().subscribe(
      (result: any) => {
        this.list_results = [];
        result.forEach(doc => {
          var curr_event : OEvent = {
            
            event_id: doc.id,
            address: doc.data()['address'],
            event_name: doc.data()['event_name'],
            event_description: doc.data()['event_description'],
            time: doc.data()['time'],
            attendees: doc.data()['attendees'],
            coord_lat: doc.data()['coord_lat'],
            coord_lon: doc.data()['coord_lon'],
            category: doc.data()['category']
          }
          this.list_results.push(curr_event);
        });
        this.eventsReady = true;
        this.dataReady.next(this.eventsReady&&this.venuesReady);
        console.log(this.list_results)
        this.ref.tick();

        
        return result;
      }
    );
  }

  getCategories() {
    this.http.get('https://api.foursquare.com/v2/venues/categories?' + this.credentials + '&v=20200919')
      .subscribe(response => {this.categories = response['response'];
        return response;}
      );
  }

  getUrl() {
    console.log(this.radius*1609.344);
    this.url = 'https://api.foursquare.com/v2/venues/search?' + this.credentials + '&near=' + this.location + '&radius=' + this.radius*1609.344 + '&query=' + this.category + '&v=20200919&m=foursquare';
    this.http.get(this.url).subscribe(
      response => {
        this.data = response['response'];
        this.hasChanges = false;
        this.venuesReady = true;
        this.dataReady.next(this.eventsReady&&this.venuesReady);
        this.ref.tick();
        return response;        
      });
  }

  getLatLon(location_input) {
    this.url = 'https://api.foursquare.com/v2/venues/search?' + this.credentials + '&near=' + location_input + '&query=' + this.category + '&v=20200919&m=foursquare';
    this.http.get(this.url).subscribe(
      response => {
        this.data = response['response'];
        this.hasChanges = false;
        return response;        
      });
  }

  searchType() {
    if (this.category.length > 0 && this.category !== 'I look for...') {
      if (this.location.length > 0) {
        this.getUrl();
        this.getEvents();
      } else {
        this.errorLocation = true;
      }
    } else {
      this.errorCategory = true;
    }
  }

  collectData() {
    this.selectData();
    this.searchType();
  }

  selectData() {
    this.location;
    this.category;
  }

  clearError(parameter) {
    if (parameter === 'location') {
      this.errorLocation = false;
    }else if (parameter === 'categories') {
      this.errorCategory = false;
    }
 
  }
  changed() {
    this.hasChanges = true;
  }
}
