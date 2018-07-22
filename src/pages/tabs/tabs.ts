import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";

@IonicPage({
    name: 'tabs',
})
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = 'home';
    tab2Root = 'about';
    tab3Root = 'contact';

    constructor() {

    }
}
