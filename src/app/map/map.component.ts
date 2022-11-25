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
        marker1.bindPopup(`Point (${ietm0.latitude}, ${ietm0.longitude})`).openPopup(); 
        marker1.addTo(this.map);

        

        const itemLast = points[points.length-1];
        
        var marker2 = L.marker([itemLast.latitude, itemLast.longitude]);
        marker2.bindPopup(`Point (${itemLast.latitude}, ${itemLast.longitude})`).openPopup();
        marker2.addTo(this.map);

        var greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        var AnimatedMarker = L.marker([ietm0.latitude, ietm0.longitude], {
          icon: greenIcon
        });
        AnimatedMarker.addTo(this.map);

        let index = 0;
        
        const intervalID = setInterval(() => {
          if (index == points.length){
            clearInterval(intervalID);
          }else{

            AnimatedMarker.setLatLng([points[index].latitude, points[index].longitude]);
            index ++;
          }
          
          
        }, 150);
      
      }
    })
    
  }

  private async initMap() {

    await this.getData();
    
  }
  constructor(private htttpClient: HttpClient, ) { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
