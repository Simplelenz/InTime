
import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'trainDetails.html',
})
export class TrainDetailsPage {
  item;

  constructor(params: NavParams) {
    this.item = params.data.item;
  }
}