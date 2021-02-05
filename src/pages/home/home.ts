import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { InfoPage } from "../info/info";
import { FirebaseApp } from "angularfire2";
import * as firebase from "firebase/app";
import 'firebase/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userID: any;
  userData = null;
  events: FirebaseListObservable<any[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,
  private toastCtrl: ToastController){
    if (this.navParams.data.user){
      this.userData = this.navParams.data.user;
    }
    this.events = this.db.list('events');
    this.photo();
    this.db.database.ref('user').orderByChild('nome').equalTo(this.userData.username).on('child_added', snap => {
      this.userID = snap.key;
    })
  }

  photo(){
    this.events.$ref.on('child_added', snap => {
      var storageRef = firebase.storage().ref();
      storageRef.child('photos/' + snap.val().url).getDownloadURL().then(function(url) {
          var test = url;
          var img = (<HTMLImageElement>document.getElementById(snap.key));
          img.src = test;

      }).catch(function(error) {
        
      });
    });
  }

  confirmar(item: any){
    var flag = false;
    this.db.database.ref('events/' + item.$key + '/confirmados').on('child_added', snap => {
      if (snap.val() == this.userData.username){
        flag = true;
      }
    });

    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    if (!flag){
      this.db.database.ref('events/' + item.$key + '/confirmados/' + this.userID).set(this.userData.username);
      this.photo();

      toast.setMessage('Você confirmou presença no evento: ' + item.nome).present();
    }else{
      this.db.database.ref('events/' + item.$key + '/confirmados/' + this.userID).remove();
      this.photo();

      toast.setMessage('Você não confirmou presença no evento: ' + item.nome).present();
    }
    
  }

  recomendar(item: any){
    var flag = false;
    this.db.database.ref('events/' + item.$key + '/recomendado').on('child_added', snap => {
      if (snap.val() == this.userData.username){
        flag = true;
      }
    });

    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    if (!flag){
      this.db.database.ref('events/' + item.$key + '/recomendado/' + this.userID).set(this.userData.username);
      this.photo();

      toast.setMessage('Você recomendou o evento: ' + item.nome).present();
    }else{
      this.db.database.ref('events/' + item.$key + '/recomendado/' + this.userID).remove();
      this.photo();

      toast.setMessage('Você deixou de recomendar o evento: ' + item.nome).present();
    }
  }

  info(item: any){
    this.navCtrl.push(InfoPage, {evento: item});
  }

}
