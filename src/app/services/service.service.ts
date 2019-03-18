import { Injectable , Input } from '@angular/core';
import {Http , Response , RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';


// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Router } from "@angular/router";

import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { BadInput } from "../exception-handler/bad-input";
import { NotFoundError } from "../exception-handler/not-found-error";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { AppError } from "../exception-handler/app-error";
// import { InternalServerError } from "../Exceptions/InterServerError";
// import { LoaderService } from "./loader.service";

@Injectable()
export class ServiceService {
    headers: Headers;
    options: RequestOptions;


  constructor(private http : Http,
    private router: Router,
                // private loaderService: LoaderService
            ) {
      this.headers = new Headers({ 'Content-Type': 'application/json',
                                    "Access-Control-Allow-Origin":"*",
                                    "Access-Control-Allow-Methods":"GET, POST, OPTIONS, PUT, PATCH, DELETE",
                                    'Access-Control-Allow-Headers':'X-Requested-With,content-type',
                                    'Access-Control-Allow-Credentials':true});
        this.options = new RequestOptions({ headers: this.headers });
   }

//   getDataFromServer(url: string): Observable<any>
//   {
//      return this.http
//                 .get(url,this.options)
//                 .map(this.extractData)
//                 .catch(this.handleError);
      
//   }

  getDataFromServer(url: string): Observable<any>
  {
     return this.http
                .get(url)
                .map(this.extractData)
                .catch(this.handleError);
      
  }

//   postDataToServer(url : string, param: any) : Observable<any>
//   {
//       return this.http
//                  .post(url,param,this.options)
//                  .map(this.extractData)
//                  .catch(this.handleError);
//   }

postDataToServer(url : string, param: any) : Observable<any>
  {
      return this.http
                 .post(url,param)
                 .map(this.extractData)
                 .catch(this.handleError);
  }

   postData(url : string) : Observable<any>
  {
      return this.http
                 .post(url,this.options)
                 .map(this.extractData)
                 .catch(this.handleError);
  }

getData(url: string): Observable<any>
  {
     return this.http
                .get(url,this.options)
                .map(this.extractData1)
                .catch(this.handleError);
      
  }


    private extractData1(response : Response){
        let body=response.text();
        var obj = JSON.parse(body);
        return obj;
  }


  private extractData(response : Response){
        let body = response.json();
        return body || {} ;
  }

//    private handleError(error: Response) {
//  
//         if(error.status === 500){
//        alert("some unexpected error");
//        return Observable.throw(new InternalServerError());
//         }
    //    this.router.navigate(['']);
        // let errMsg = (error.message) ? error.message :
            // error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        // console.error(errMsg);
        // return Observable.throw(errMsg);
    // }

   private handleError(error : Response)
      {
          if(error.status == 0){
          return Observable.throw(new ConnectionTimeOut()); }

          if(error.status == 400)
            return Observable.throw(new BadInput());

          if(error.status == 404)
            return Observable.throw(new NotFoundError());

          if(error.status == 500)
            return Observable.throw(new InternalServerError());
        
          return Observable.throw(new AppError());
      }

}
