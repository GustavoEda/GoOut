import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  confirmados: FirebaseListObservable<any[]>;
  recomendado: FirebaseListObservable<any[]>;
  eventID: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    this.eventID = '';

    if (this.navParams.data.evento){
      this.eventID = this.navParams.data.evento.$key;
    }

    this.confirmados = this.db.list('events/' + this.eventID + '/confirmados'); 
    this.recomendado = this.db.list('events/' + this.eventID + '/recomendado'); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
