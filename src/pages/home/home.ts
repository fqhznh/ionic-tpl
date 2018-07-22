import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {NavController} from 'ionic-angular';
import {HttpService} from "../../providers/http-service/http-service";

@IonicPage({
    name: 'home'
})
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController, public httpService: HttpService) {

    }


    public testApi() {
        this.httpService.get('https://api.github.com/users/seeschweiler');
    }
}
