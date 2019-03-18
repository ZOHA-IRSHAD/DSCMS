import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { GlobalAdvariable } from '../GlobalAdvariable';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ServerService } from '../server.service';
// import { ServerImageService }from '../serverimage.service';
// import { ServiceService } from "../services/service.service";

import { Http, Response } from '@angular/http';
import { NgxPaginationModule } from 'ngx-pagination';
import * as Adglobal from '../GlobalAdvariableInterface';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { Router } from "@angular/router";
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

import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-live-add',
  templateUrl: './live-add.component.html',
  styleUrls: ['./live-add.component.css']
  
})
export class LiveAddComponent implements OnInit {
  id: string;
  UrlforgetAdverts = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/getads';
 UrlforUpdateAdvert='http://'+globalValues.ipAddress+'/cafeteriamanagement/updateads';
  constructor(private AdserverService: ServerService,
    private notifier : NotificationsService,
       private spinnerService: SpinnerService,
       private router:Router,

   ) { }
  public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    }
  metaData: any[] = [];
  p: number = 1;//pagination
  location_details = [];

  arrAdvertLive: any[] = [];
  sendAdvertid: any[] = [];

  arrAdvertExpired: any[] = [];
  

  ngOnInit() {
    this.spinnerService.show('mySpinner');
      this.AdserverService.getData(this.UrlforgetAdverts)
      .subscribe(advert_details => {
     
        this.metaData = advert_details;
   
        for (let i = 0; i < this.metaData.length; i++) {
          if (this.metaData[i].status == "LIVE") {
            this.arrAdvertLive.push(this.metaData[i]);
          }
        }

this.sortArray(this.arrAdvertLive);
this.spinnerService.hide('mySpinner');

(error : AppError) =>{
 
  this.handleException(error);}
      });


  }
      sortArray(array: any[]){
  array.sort(function (a, b) {
    
     if(a.vendor_id > b.vendor_id){
                                              return 1;
                                            } else if(a.vendor_id == b.vendor_id){
                                              return 0;
                                            } else{
                                              return -1;
                                            }    
  });
}
      Delete(id: string) {

    this.id=id;

    for (let i = 0; i < this.arrAdvertLive.length; i++) {
      if (this.arrAdvertLive[i]._id === this.id) {
        this.arrAdvertLive.splice(i, 1);
        this.sendAdvertid.push({ "_id": id })
      }

    }

    this.AdserverService.SaveData(this.UrlforUpdateAdvert,this.sendAdvertid)
    .subscribe(response=>{
  
            if(response.update==='successfull'){
 this.notifier.success("The Row has been successfully Deleted");}
  else {
          this.notifier.error("Data not Deleted!!!Cannot find the server");
        }

        (error : AppError) =>{
 
          this.handleException(error);}
    });
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
      }