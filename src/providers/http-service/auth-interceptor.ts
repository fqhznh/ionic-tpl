import {Injectable} from '@angular/core';
import {StorageService} from "../storage-service/storage-service";
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {Observable, ObservableInput} from "rxjs/Observable";
import {debounceTime, mergeMap, retry} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        public storage: StorageService
    ) {

    }

    /**
     * 获取token令牌
     * @returns {any}
     */
    private getToken() {
        let user: any = this.storage.read('user');
        if (user) {
            console.log('token==============>' + user.token);
            return user.token;
        }
        return '';
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const request = req.clone({
            headers: req.headers.set('token', this.getToken()).set('Authentication', '*').set('X-Requested-With', '*')
        });

        return next.handle(request).pipe(retry(3), debounceTime(500), mergeMap(this.processResponse));
    }

    processResponse(event: any): ObservableInput<any> {
        if (event instanceof HttpResponse) {
            let headers = event.headers;
            console.log('响应headers=====>', headers);
            if (headers) {
                let code = headers.get('code');
                if (code && code != '0') {
                    return Observable.throw(event);
                }
            }
        }
        return Observable.create(observer => observer.next(event));
    }

}