import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { GlobalAdvariable } from '../GlobalAdvariable';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ServerService } from '../server.service';
// import { Router } from "@angular/router";
// import { ServerImageService }from '../serverimage.service';
// import { ServiceService } from "../services/service.service";
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { NgxPaginationModule } from 'ngx-pagination';
import * as Adglobal from '../GlobalAdvariableInterface';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
// import { VendorRegistrationComponent } from '../vendor-registration/';
// import {Image} from '../image';
// import * as imageglob from '../imageinterface';
import { UploadFileService } from '../upload-file.service';
// import * as globalValues from "../globalVar";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-advert-details',
  templateUrl: './advert-details.component.html',
  styleUrls: ['./advert-details.component.css']
})
export class AdvertDetailsComponent implements OnInit {
  UrlforgetAdverts = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/getads';
  constructor(private AdserverService: ServerService, 
    private spinnerService: SpinnerService,
    private router:Router,) { }
  metaData: any[] = [];
  p: number = 1;//pagination
  location_details = [];

  arrAdvertLive: any[] = [];
  sendAdvertid: any[] = [];

  arrAdvertExpired: any[] = [];

  ngOnInit() {
    this.AdserverService.getData(this.UrlforgetAdverts)
      .subscribe(advert_details => {
      
        this.metaData = advert_details;
  
        for (let i = 0; i < this.metaData.length; i++) {
          if (this.metaData[i].status == "LIVE") {
            this.arrAdvertLive.push(this.metaData[i]);
          }
          else if (this.metaData[i].status == "expired") {
            this.arrAdvertExpired.push(this.metaData[i]);
          }
        }

        (error : AppError) =>{
          this.handleException(error);}
        

      });


  }
  Delete(id: any) {

   

    for (let i = 0; i < this.arrAdvertLive.length; i++) {
      if (this.arrAdvertLive[i]._id === id) {
        this.arrAdvertLive.splice(i, 1);
        this.sendAdvertid.push({ "_id": id })
      }

    }
 
  }
  handleException(error : AppError){
    this.spinnerService.hide('mySpinner');
        if(error instanceof ConnectionTimeOut){
          globalValues.setErrorCode(0);
          this.router.navigate(['/exception']);
       }
       else if(error instanceof BadInput){
          globalValues.setErrorCode(400);
          this.router.navigate(['/exception']);
         }

       else  if(error instanceof NotFoundError){
          globalValues.setErrorCode(404);
          this.router.navigate(['/exception']);           
         }

        else if(error instanceof InternalServerError){
           globalValues.setErrorCode(500);
           this.router.navigate(['/exception']);
         }
         else
           {
             globalValues.setErrorCode(-1);
             throw error;
           } 
     }
  Refresh()
  {
    this.arrAdvertLive=[];
    this.arrAdvertExpired=[];
 
    this.ngOnInit();
  }


  
  }



