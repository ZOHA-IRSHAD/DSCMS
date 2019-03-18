import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class LoginService {
    headers: Headers;
    options: RequestOptions;
    

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json',
                                     "Access-Control-Allow-Origin":"*",
                                     "Access-Control-Allow-Methods":"GET, POST, OPTIONS, PUT, PATCH, DELETE",
                                     'Access-Control-Allow-Headers':'X-Requested-With,content-type',
                                    'Access-Control-Allow-Credentials':true});
        this.options = new RequestOptions({ headers: this.headers });
    }

    getService(url: string): Observable<any> {
        return this.http
            .get(url, this.options).map(this.extractData)
            .catch(this.handleError);
    }

     createService(url: string, param: any): Observable<any> {
  
        return this.http
            .post(url, param, this.options).map(this.extractData)
            .catch(this.handleError);
    }

    updateService(url: string, param: any): Observable<any> {
        let body = JSON.stringify(param);
        return this.http
            .put(url, body, this.options).map(this.extractData)
            .catch(this.handleError);
    }

     deleteService(url: string, param: any): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                let val = param[key];
                params.set(key, val);
            }
        }
        this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
            .delete(url, this.options).
            map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}