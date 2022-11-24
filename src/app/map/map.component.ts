import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  // private data: [];

  private async getData() {
    
    this.htttpClient.get('http://127.0.0.1:8000/api/location').subscribe((result:any) => {
      console.log(result);
      if(result != undefined){
        const points = result
        const ietm0 = points[0];
        this.map = L.map('map', {
          center: [ ietm0.latitude, ietm0.longitude ],
          zoom: 15
        });

       
    
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/2/{x}/{y}.png', {
          maxZoom: 18,
          minZoom: 3,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
    
        tiles.addTo(this.map);

        console.log("points", points.length);
        let polylinePoints = [];
        for(var i=0; i < points.length; i++){
          polylinePoints.push(L.latLng(points[i].latitude, points[i].longitude))
          console.log(points[i].latitude, points[i].longitude);
        }
        console.log(polylinePoints.length);
        
        var polyline = L.polyline(polylinePoints).addTo(this.map);
        var marker1 = L.marker([ietm0.latitude, ietm0.longitude]);
        marker1.bindPopup('This is Tutorialspoint').openPopup();
        marker1.addTo(this.map);

        const itemLast = points[points.length-1];
        
        var marker2 = L.marker([itemLast.latitude, itemLast.longitude]);
        marker2.bindPopup('This is Tutorialspoint').openPopup();
        marker2.addTo(this.map);
      
      }
    })
    
  }

  private async initMap() {

    await this.getData();
    
  }
  constructor(private htttpClient: HttpClient) { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
