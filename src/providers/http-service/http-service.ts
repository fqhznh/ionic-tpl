import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StorageService} from "../storage-service/storage-service";
import {NativeService} from "../native-service/native-service";

@Injectable()
export class HttpService {

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public nativeService: NativeService
    ) {

    }

    private getHttpOptions(headers: any = null, params: any = null, body: any = null): any {
        return {
            headers: headers ? new HttpHeaders(headers) : new HttpHeaders(),
            observe: 'body',
            body: body,
            responseType: 'text',
            params: params ? new HttpParams({fromObject: params}) : null
        }
    }

    public showError(msg: string = '网络不给力') {
        this.nativeService.showToast(msg);
    }

    private request(method: string, url: string, options: any): Promise<any> {
        let me = this;
        return new Promise<any>((resolve, reject) => {
            console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
            me.http.request<any>(method, url, options).subscribe((res: any) => {
                this.nativeService.hideLoading();
                resolve(res);
            }, error => {
                this.nativeService.hideLoading();
                let message = error.message || '系统异常';
                let status = error.status;
                if(status == 404) {
                    message = '请求接口无效';
                } else if(status == 200) {
                    let headers = error.headers;
                    if (headers) {
                        let code = headers.get('code');
                        if (code == '1000') {
                            console.log('没有登陆');
                        } else {
                            let msg = headers.get('msg');
                            if (msg) {
                                message = decodeURIComponent(msg);
                            }
                        }
                    }
                }
                console.log('error:message===>', message);
                this.showError(message);
                reject(message);
            })
        });
    }

    public get(url: string, paramMap: any = null): Promise<any> {
        let options = this.getHttpOptions(null, paramMap);
        return this.request('GET', url, options);
    }

    public post(url: string, body: any = null): Promise<any> {
        return this.request('POST', url, this.getHttpOptions({
            'Content-Type': 'application/json; charset=UTF-8'
        }, null, body));
    }

    public postFormData(url: string, paramMap: any = {}): Promise<any> {
        return this.request('POST', url, this.getHttpOptions({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }, paramMap, null));
    }

}
