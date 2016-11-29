import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
 
declare var google;
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public currentLocation;
  public trainStations;
  public station;
 
  constructor(public navCtrl: NavController) {
    
  }
 
  ionViewDidLoad(){
    this.loadMap();
    
  }
 
   loadMap(){
 
    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      this.currentLocation = latLng;
      console.log(this.currentLocation);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // this.addMarker();
      this.findTransit();
 
    }, (err) => {
      console.log(err);
    });
  }

  addMarker(){
 
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.currentLocation
  });
 
  let content = "<h4>Information!</h4>";          
 
  this.addInfoWindow(marker, content);

  // this.displayRoute();
 
}

addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
 
}

findTransit(){
  // let map = this.map;

  var request = {
    location: this.currentLocation,
    radius: '5000',
    types: ['train_station']
  };

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(this.map);
  service.nearbySearch(request, (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // for (var i = 0; i < results.length; i++) {
      for (var i = 0; i < 1; i++) {
        this.trainStations = results[i];
        this.station = results[0];
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        // var marker = new google.maps.Marker({
        //   map: this.map,
        //   icon: 'http://maps.google.com/mapfiles/kml/shapes/rail.png',
        //   position: this.trainStations.geometry.location
        // });
        this.station = this.station.name;
        this.displayRoute();
        // this.station = 'Kompannavidiya Railway Station';
        // console.log(this.station)
      }
    }
  });
  
}

displayRoute(){

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
        
  directionsDisplay.setMap(this.map);

  directionsService.route({
          origin: this.currentLocation,
          destination: this.station,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}
}
