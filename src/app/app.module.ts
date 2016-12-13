import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TrainInfoPage } from '../pages/train-info/train-info';
import { TrainDetailsPage } from '../pages/trainDetails/trainDetails';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TrainInfoPage,
    TrainDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TrainInfoPage,
    TrainDetailsPage
  ],
  providers: []
})
export class AppModule {}
