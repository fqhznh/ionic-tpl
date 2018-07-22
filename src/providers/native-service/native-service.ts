import {Injectable} from '@angular/core';
import {AlertController, Loading, LoadingController, Platform, ToastController} from "ionic-angular";
import {Toast} from "@ionic-native/toast";
import {Network} from "@ionic-native/network";
import {AppVersion} from "@ionic-native/app-version";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {FileOpener} from "@ionic-native/file-opener";

@Injectable()
export class NativeService {

    private loading: Loading;
    private loadingIsOpen: boolean = false;

    constructor(
        public platform: Platform,
        public toast: Toast,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public network: Network,
        public appVersion: AppVersion,
        public camera: Camera,
        public file: File,
        public transfer: FileTransfer,
        public alertCtrl: AlertController,
        public fileOpener: FileOpener
    ) {

    }

    /**
     * 是否真机环境
     * @return {boolean}
     */
    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }

    /**
     * 是否android真机环境
     * @return {boolean}
     */
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    /**
     * 是否ios真机环境
     * @return {boolean}
     */
    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }

    /**
     * 统一调用此方法显示提示信息
     * @param message 信息内容
     * @param duration 显示时长
     */
    showToast(message: string = '操作完成', duration: number = 2000): void {
        if (this.isMobile()) {
            this.toast.show(message, String(duration), 'bottom').subscribe();
        } else {
            this.toastCtrl.create({
                message: message,
                duration: duration,
                position: 'middle',
                showCloseButton: false
            }).present();
        }
    }

    /**
     * 统一调用此方法显示loading
     * @param content 显示的内容
     */
    showLoading(content: string = ''): void {
        if (this.loadingIsOpen) {
            this.updateLoading(content);
        } else {
            this.loadingIsOpen = true;
            this.loading = this.loadingCtrl.create({
                content: content
            });
            this.loading.present();
            // setTimeout(() => {//最长显示10秒
            //     this.loadingIsOpen && this.loading.dismiss();
            //     this.loadingIsOpen = false;
            // }, 10000);
        }
    }

    /**
     * 更新loading文字描述
     * @param {string} content
     */
    updateLoading(content: string = ''): void {
        if (this.loadingIsOpen) {
            this.loading.setContent(content);
        }
    }

    /**
     * 关闭loading
     */
    hideLoading(): void {
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
    }

    /**
     * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
     */
    getNetworkType(): string {
        if (!this.isMobile()) {
            return 'wifi';
        }
        return this.network.type;
    }

    /**
     * 判断是否有网络
     * @returns {boolean}
     */
    isConnecting(): boolean {
        return this.getNetworkType() != 'none';
    }

    /**
     * 显示警告信息
     * @param info
     */
    warn(info): void {
        console.log('%cNativeService/' + info, 'color:#e8c406');
    }

    /**
     * 获得app版本号,如0.01
     * @description  对应/config.xml中version的值
     * @returns {Promise<string>}
     */
    getVersionNumber(): Promise<string> {
        return new Promise((resolve) => {
            this.appVersion.getVersionNumber().then((value: string) => {
                resolve(value);
            }).catch(err => {
                this.warn('getVersionNumber:' + err);
            });
        });
    }

    /**
     * 获得app name
     * @description  对应/config.xml中name的值
     * @returns {Promise<string>}
     */
    getAppName(): Promise<string> {
        return new Promise((resolve) => {
            this.appVersion.getAppName().then((value: string) => {
                resolve(value);
            }).catch(err => {
                this.warn('getAppName:' + err);
            });
        });
    }

    /**
     * 获得app包名/id
     * @description  对应/config.xml中id的值
     * @returns {Promise<string>}
     */
    getPackageName(): Promise<string> {
        return new Promise((resolve) => {
            this.appVersion.getPackageName().then((value: string) => {
                resolve(value);
            }).catch(err => {
                this.warn('getPackageName:' + err);
            });
        });
    }

    /**
     * 使用cordova-plugin-camera获取照片
     * @param options
     * @returns {Promise<string>}
     */
    getPicture(options: CameraOptions = {}): Promise<string> {
        let ops: CameraOptions = Object.assign({
            sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
            destinationType: this.camera.DestinationType.DATA_URL,//默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
            quality: 100,//图像质量，范围为0 - 100
            allowEdit: false,//选择图片前是否允许编辑
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 0,//缩放图像的宽度（像素）
            targetHeight: 0,//缩放图像的高度（像素）
            saveToPhotoAlbum: true,//是否保存到相册
            correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
        }, options);
        return new Promise((resolve) => {
            this.camera.getPicture(ops).then((imgData: string) => {
                resolve(imgData);
            }, (err) => {
                err == 20 && this.showToast('没有权限,请在设置中开启权限');
                this.warn('getPicture:' + err)
            });
        });
    }

    /**
     * 通过拍照获取照片
     * @param options
     * @return {Promise<string>}
     */
    getPictureByCamera(waterText: string, options: CameraOptions = {}): Promise<string> {
        return new Promise((resolve) => {
            this.getPicture(Object.assign({
                sourceType: this.camera.PictureSourceType.CAMERA,
                waterText: waterText,
                targetWidth: 800,
                targetHeight: 800,
                destinationType: this.camera.DestinationType.FILE_URI//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
            }, options)).then((imgData: string) => {
                resolve(imgData);
            }).catch(err => {
                String(err).indexOf('cancel') != -1 ? this.showToast('取消拍照', 1500) : this.showToast('获取照片失败');
            });
        });
    }

    /**
     * 通过图库获取照片
     * @param options
     * @return {Promise<string>}
     */
    getPictureByPhotoLibrary(options: CameraOptions = {}): Promise<string> {
        return new Promise((resolve) => {
            this.getPicture(Object.assign({
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.FILE_URI//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
            }, options)).then((imgData: string) => {
                resolve(imgData);
            }).catch(err => {
                String(err).indexOf('cancel') != -1 ? this.showToast('取消选择图片', 1500) : this.showToast('获取照片失败');
            });
        });
    }

    /**
     * 根据图片绝对路径转化为base64字符串
     * @param url 绝对路径
     * @param callback 回调函数
     */
    convertImgToBase64(url: string, callback) {
        this.getFileContentAsBase64(url, function (base64Image) {
            callback.call(this, base64Image.substring(base64Image.indexOf(';base64,') + 8));
        })
    }

    private getFileContentAsBase64(path: string, callback) {
        function fail(err) {
            console.log('Cannot found requested file' + err);
        }

        function gotFile(fileEntry) {
            fileEntry.file(function (file) {
                let reader = new FileReader();
                reader.onloadend = function (e) {
                    let content = this.result;
                    callback(content);
                };
                reader.readAsDataURL(file);
            });
        }
        this.file.resolveLocalFilesystemUrl(path).then(fileEnter => gotFile(fileEnter)).catch(err => fail(err));
    }

    /**
     * 上传图片
     * @param {string} url
     * @param imageUrl
     * @param params
     * @returns {Promise<any>}
     */
    public uploadImage(url: string, imageUrl, params: any = {}): Promise<any> {
        return new Promise<any>((resolve) => {
            let fileTransfer: FileTransferObject = this.transfer.create();
            let options: FileUploadOptions = {
                fileKey: 'image',
                fileName: imageUrl.substr(imageUrl.lastIndexOf('/') + 1),  // 文件类型
                headers: {},
                params: params    // 如果要传参数，写这里
            }
            fileTransfer.upload(imageUrl, encodeURI(url), options).then(data => {
                let code = null;
                if (data.headers) {
                    code = data.headers['code'];
                }
                if (code && code != '0') {
                    let msg = data.headers['msg'];
                    if (msg) {
                        this.showToast(decodeURIComponent(msg));
                    } else {
                        this.showToast('系统异常');
                    }
                } else {
                    resolve(JSON.parse(data.response));
                }
            }).catch(err => {
                this.showToast('系统异常');
            })
        });
    }

    /**
     * 下载APP
     */
    downloadApp(url, name) {
        if (this.isAndroid()) {
            let alert = this.alertCtrl.create({
                title: '下载进度：0%',
                enableBackdropDismiss: false,
                buttons: ['后台下载']
            });
            alert.present();

            const fileTransfer: FileTransferObject = this.transfer.create();
            const apk = this.file.externalRootDirectory + name;

            fileTransfer.download(url, apk).then(() => {
                this.fileOpener.open(apk, 'application/vnd.android.package-archive');
            });

            fileTransfer.onProgress((event: ProgressEvent) => {
                let num = Math.floor(event.loaded / event.total * 100);
                if (num === 100) {
                    alert.dismiss();
                } else {
                    let title = document.getElementsByClassName('alert-title')[0];
                    title && (title.innerHTML = '下载进度：' + num + '%');
                }
            });
        }
    }
}
