import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
 import * as globalValues from "./globalVar";
 import * as Adglobal from './GlobalAdvariableInterface';
import { GlobalAdvariable } from './GlobalAdvariable';
@Injectable()
export class UploadFileService {
 
  constructor(private http: HttpClient) {}
 post='https://'+globalValues.ipAddress+'/cafeteriamanagement/addimageads'
  pushFileToStorage(file: File,formValues:GlobalAdvariable)
  : Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
//  formdata.getAll(id);{"_id":id}
    formdata.append('ad_image', file);
    formdata.append('formvalues',JSON.stringify(formValues));
    



    const req = new HttpRequest('POST',this.post,formdata, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }}