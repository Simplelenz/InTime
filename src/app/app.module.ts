import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TrainInfoPage } from '../pages/train-info/train-info';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TrainInfoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TrainInfoPage
  ],
  providers: []
})
export class AppModule {}
