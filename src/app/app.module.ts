import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {AppVersion} from '@ionic-native/app-version';
import {Camera} from '@ionic-native/camera';
import {Toast} from '@ionic-native/toast';
import {File} from '@ionic-native/file';
import {FileTransfer} from '@ionic-native/file-transfer';
import {Network} from '@ionic-native/network';
import {Keyboard} from '@ionic-native/keyboard';
import {Broadcaster} from "@ionic-native/broadcaster";
import {ImagePicker} from "@ionic-native/image-picker";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {FileOpener } from '@ionic-native/file-opener';
import {CallNumber} from "@ionic-native/call-number";
import {AndroidPermissions} from "@ionic-native/android-permissions";

import { NativeService } from '../providers/native-service/native-service';
import { HttpService } from '../providers/http-service/http-service';
import { StorageService } from '../providers/storage-service/storage-service';
import {NativeStorage} from "@ionic-native/native-storage";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "../providers/http-service/auth-interceptor";


@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule, HttpClientModule,
        IonicModule.forRoot(MyApp, {
            tabsHideOnSubPages: 'true',
            pageTransition: 'ios-transition',
            backButtonIcon: 'arrow-back',
            backButtonText: '',
            mode: 'md',
            scrollAssist: true,
            swipeBackEnabled: true
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        AppVersion,
        Camera,
        Toast,
        File,
        FileTransfer,
        Network,
        Keyboard,
        FileOpener,
        Broadcaster,
        ImagePicker,
        CallNumber,
        NativeStorage,
        AndroidPermissions,
        NativeService,
        HttpService,
        StorageService
    ]
})
export class AppModule {
}
