import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation, PositionError, Geoposition } from 'ionic-native';
import { TrainInfoPage } from '../train-info/train-info';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
declare var google;
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  posts: any
  data: any

  public currentLocation;
  public trainStations;
  public station;
  public infoWindow;
 
  constructor(public navCtrl: NavController, public http: Http) {
        this.data = {};
        this.data.trainStationLat = '';
        this.data.trainStationLong = '';
 
        this.http = http;
  }

  doRefresh(refresher) {
    
    console.log('Begin async operation', refresher);
    this.infoWindow.close();
    this.findTransit();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  ionViewDidLoad(){
    setInterval(this.ionViewDidEnter(),1000);
    // setInterval(this.loadMap(),1000);
    // // // this.getDataFromServer();
    // setInterval(this.getDataFromServer(), 10000);
  }
  ionViewDidEnter(){
    this.loadMap();
    this.getDataFromServer();
  }
   loadMap(){
    
    console.log("map loaded");

    Geolocation.watchPosition().subscribe((position: Geoposition) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      this.currentLocation = latLng;
      // console.log(this.currentLocation);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addMarker();
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
 
  // let content = "<h4>I'm Here!</h4>" + "<button onClick='myfunc()'>Ok</button>";          
 
  // this.addInfoWindow(marker, content);

  // this.displayRoute();
console.log("map loaded");
}

addInfoWindow(marker, content){
 
    this.infoWindow = new google.maps.InfoWindow({
    content: content
    
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    // infoWindow.open(this.map, marker);
    this.navCtrl.push(TrainInfoPage);
  });
  this.infoWindow.open(this.map, marker);
 
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
        var marker = new google.maps.Marker({
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/kml/shapes/rail.png',
          position: this.trainStations.geometry.location
        });
        this.data.trainStationLat = this.station.geometry.location.lat();
        this.data.trainStationLong = this.station.geometry.location.lng();
        this.station = this.station.name;
        
        this.displayRoute();
        let timeToReach = String(this.posts.timeToReach);

        // let content = document.createElement('div');
        // let div = document.createElement('div');
        // div.id = "test";
        // content.appendChild(div);
        // let h2 = document.createElement('h2');
        // h2.id = "h2";
        // h2.innerHTML = Date();
        // div.appendChild(h2);
        // document.getElementById("h2").innerHTML = "hello";
        let content = "<h4>Train to come</h4>"+ "Train Name: Ruhunu Kumari"+
        "<br>Destination: Matara"+
        // "<br>Distance: " +this.posts.distance+ " Km"+
        "<br><b>Time to Reach here: </b>"+timeToReach.bold().fontcolor("green")
        .fontsize(6)+ "<b> Hrs</b>";
        this.addInfoWindow(marker, content);
        // this.station = 'Kompannavidiya Railway Station';
        // console.log(this.station)
      }
    }
  });
  
}

displayRoute(){

  var rendererOptions = {
  map: this.map,
  suppressMarkers : true
}

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        
  // directionsDisplay.setMap(this.map);
  

  directionsService.route({
          origin: this.currentLocation,
          destination: this.station,
          travelMode: 'DRIVING',
          provideRouteAlternatives: true
        }, (response, status) => {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}

getDataFromServer(){
  this.http.get('http://emebedintime.comxa.com/getTrainInfo.php')
  .map(res => res.json())
  .subscribe(data => {
        console.log(data);
        this.posts = data;
        // console.log(this.posts);
    });
}

// sendStationLocToServer() {
//         var link = 'http://nikola-breznjak.com/_testings/ionicPHP/api.php';
//         var data = JSON.stringify({trainStationLat: this.data.trainStationLat,
//           trainStationLong: this.data.trainStationLat});
        
//         this.http.post(link, data)
//         .subscribe(data => {
//          this.data.response = data._body;
//         }, error => {
//             console.log("Oooops!");
//         });
//   }

}
