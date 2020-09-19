import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { IEvent } from '../interfaces/event';
import * as L from 'leaflet';
import 'rxjs/Rx';

@Injectable()
export class DataGetService {
  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  public categories;
  public data;
  private credentials = 'client_id=T3G1LFSOOT1SLHVM5M0Z5TAORW2G0ZDJRPO0XH4DMZ5CJJD5&client_secret=1CYBI50VHYH313YZUBM41NL2DLESNEJTIXPN5IFDPNGAYAAQ';
  private url = '';
  private location = '';
  public category = 'I look for...';
  private errorCategory: boolean = false;
  private errorLocation: boolean = false;
  private hasChanges: boolean = false;
  public list_results: Array<IEvent> = [];

  createEvent(data) {
    return new Promise<any>((resolve, reject) =>{
        this.firestore
            .collection("scheduled_events")
            .add(data)
            .then(res => {}, err => reject(err));
    });
  }

  getEvents() {
    
    this.firestore.collection("scheduled_events").get().subscribe(
      (result: any) => {
        result.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          this.list_results = [];
          var curr_event : IEvent = {
            
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

        
        return result;
      }
    );

    


//     return this.db.list('/products').snapshotChanges().pipe(
//   map((products: any[]) => products.map(prod => {
//     const payload = prod.payload.val();
//     const key = prod.key;
//     return <any>{ key, ...payload };
//   })),
// );
  }

  



  getCategories() {
    this.http.get('https://api.foursquare.com/v2/venues/categories?' + this.credentials + '&v=20200919')
      .subscribe(response => {this.categories = response['response'];
        return response;}
      );
  }


  getUrl(map: L.Map) {
    this.url = 'https://api.foursquare.com/v2/venues/search?' + this.credentials + '&near=' + this.location + '&query=' + this.category + '&v=20200919&m=foursquare';
    this.http.get(this.url).subscribe(
      response => {
        this.data = response['response'];
        this.hasChanges = false;
        for (const c of this.data['venues']){
          const loc = c['location']
          const marker = L.marker([loc['lng'], loc['lat']]).addTo(map);
          console.log(c)
        }
        return response;        
      });
  }

  searchType(map: L.Map) {
    if (this.category.length > 0 && this.category !== 'I look for...') {
      if (this.location.length > 0) {
        this.getUrl(map);
      } else {
        this.errorLocation = true;
      }
    } else {
      this.errorCategory = true;
    }
  }

  collectData(map: L.Map) {
    this.selectData();
    this.searchType(map);
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
