import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { HomePage } from "../home/home";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData = null;

  constructor(public navCtrl: NavController, private facebook: Facebook, public db: AngularFireDatabase) {
  }

  loginWithFB(){
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.userData = {id: profile['id'], email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
        this.db.database.ref('user/' + this.userData.id).set({
          nome: this.userData.username,
          pontuacao: 0
        });
        this.navCtrl.setRoot(HomePage, {user: this.userData});
      });
    });
  }

}
