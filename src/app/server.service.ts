import { Injectable} from '@angular/core';
import { Http,Response,Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { HttpModule } from '@angular/http';
import { HttpClient, HttpResponse, HttpEventType, HttpEvent, HttpRequest,HttpHeaders } from '@angular/common/http';
import { FormBuilder,FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule,AbstractControl} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import * as Adglobal from './GlobalAdvariableInterface';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'; 
import 'rxjs/add/observable/throw'; 
import 'rxjs/add/operator/catch'; 
 import 'rxjs/add/operator/debounceTime'; 
 import 'rxjs/add/operator/distinctUntilChanged'; 
 import 'rxjs/add/operator/do'; 
 import 'rxjs/add/operator/filter'; 
 import 'rxjs/add/operator/map'; 
 import 'rxjs/add/operator/switchMap'; 
//  import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
// import { HttpClient, HttpResponse, HttpEventType, HttpEvent, HttpRequest,HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';



import { Globalvariable } from './globalvariable';
import { GlobalAdvariable } from './GlobalAdvariable';


@Injectable()
export class ServerService{
    headers: Headers; 
  options: RequestOptions; 

    data:any[]=[];
    constructor(private http:Http,
        // private http1:HttpClient
){}
     
    // StoreImagesData(vendor_image: File,AdvertForm:any): Observable<HttpEvent<{}>> {
    //     let formdata: FormData = new FormData();
    //     formdata.append('vendor_image', vendor_image);
    //     formdata.append('vendor_data',AdvertForm);
    //     let headers: any = new Headers();
    //    headers.set('headers','multipart/form-data');
    //     // return this.http.post('http://scms-5ac34.firebaseio.com/data.json',Servers);
    //     const req = new HttpRequest('POST', 'http://10.53.168.101:8080/cafeteriamanagement/addvendor', formdata,{
    //   reportProgress: true,
    //   responseType: 'text',
      
    // });
    //     return this.http1.request(req);
    // }
    //  StoreAdData(AddData:GlobalAdvariable){
    //     return this.http.post('http://10.53.168.101:8080/cafeteriamanagement/insertads',AddData);//http://10.53.168.101:8080/cafeteriamanagement/insertads'
    // }
    

    SaveData(url : string, param: any) : Observable<any>
        {
  
            return this.http
            .post(url,param,this.options)
            .map(this.extractData)
            .catch(this.handleError);
        }  

          SaveImageData(url : string, param: any ) : Observable<any>
        {
          
            return this.http
            .post(url,param,this.options)
            .map(this.extractData)
            .catch(this.handleError);
        }  
     getData(url: string): Observable<any> { 
         return this.http 
             .get(url, this.options) 
             .map(this.extractData) 
             .catch(this.handleError); 
     } 
 private extractData(res: Response) { 
        let body = res.json(); 
         return body || {};     } 

         private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    
   
       
    }
