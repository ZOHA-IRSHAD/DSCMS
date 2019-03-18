import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { GlobalAdvariable } from '../GlobalAdvariable';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ServerService } from '../server.service';
import { Http, Response } from '@angular/http';
import { NgxPaginationModule } from 'ngx-pagination';
import * as Adglobal from '../GlobalAdvariableInterface';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadFileService } from '../upload-file.service';

import { SpinnerService } from "angular-spinners";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";


@Component({
  selector: 'app-expired-add',
  templateUrl: './expired-add.component.html',
  styleUrls: ['./expired-add.component.css']
})
export class ExpiredAddComponent implements OnInit {
 UrlforgetAdverts = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/getads';
  constructor(private AdserverService: ServerService,
  private router:Router,
  private spinnerService: SpinnerService 	 ) { }
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
          if (this.metaData[i].status == "expired") {
            this.arrAdvertExpired.push(this.metaData[i]);
          }
        }

this.sortArray(this.arrAdvertExpired);
this.spinnerService.hide('mySpinner');


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



}
