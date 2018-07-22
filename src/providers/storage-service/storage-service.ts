import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    write (key: string, value: any) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    read<T>(key: string, defaultValue:T = null): T {
        let value: string = localStorage.getItem(key);

        if (value && value != "undefined" && value != "null") {
            return <T>JSON.parse(value);
        }

        return defaultValue;
    }

    readArr<T>(key: string): Array<T> {
        let value: string = localStorage.getItem(key);
        if(value && value != 'undefined' && value != 'null') {
            return JSON.parse(value);
        }
        return null;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }

}
