import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {NavController} from 'ionic-angular';

@IonicPage({
    name: 'about'
})
@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    constructor(public navCtrl: NavController) {

    }

}
