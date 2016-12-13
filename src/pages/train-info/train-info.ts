

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {TrainDetailsPage} from'../trainDetails/trainDetails';

@Component({
  selector: 'page-train-info',
  templateUrl: 'train-info.html'
})

  
/*
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Navigation</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  <ion-list>
    <button ion-item *ngFor="let item of items" (click)="openTrainDetailsPage(item)" icon-left>
      <ion-icon [name]="'logo-' + item.icon" [ngStyle]="{'color': item.color}" item-left></ion-icon>
      {{ item.title }}
    </button>
  </ion-list>
</ion-content>
`
})*/
export class TrainInfoPage {
  items = [];

  constructor(public nav: NavController , public alertCtrl: AlertController) {
  this.initializeItems();
  }

  initializeItems(){
    this.items = [
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Galle',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
       'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Dehiwala',
        'Name':'Sagarika',
        'ArrivalTime':'1.30',
        'DepartureTime':'1.40',
        'DestinationTime':'5.00',
         'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Galle',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
         'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Moratuwa',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
        'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Moratuwa',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
         'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Galle',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
        'transits':[{first:'panadura'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Galle',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
         'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Matara',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
        'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
      {
        'OriginName': 'Colombo',
        'DestinationName': 'Galle',
        'Name':'Sagarika',
        'ArrivalTime':'11.30',
        'DepartureTime':'11.40',
        'DestinationTime':'3.00',
        'transits':[{first:'colpity'},{second:'bambalapitiya'},{third:'wellawatte'},{fourth:'Dehiwala'}],
      },
    ]
  }


  presentAlert(item) {
  let alert = this.alertCtrl.create({
    
    title: 'Train',
    subTitle: 'Time remaining to depart : 5 min',
    buttons: [{text: 'OK',
             color:'secondary',
             shape:'round',
             size:'large',
             align:'center',
              handler: () => {
               this.nav.push(TrainDetailsPage, { item: item });
              }
    }]
  });
  alert.present();
  }

  openTrainDetailsPage(item) {
    this.nav.push(TrainDetailsPage, { item: item });

  }


 getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((items) => {
        // return(items.transits.first.toLowerCase().indexOf(val.toLowerCase()) > -1);
        return (items.DestinationName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


}