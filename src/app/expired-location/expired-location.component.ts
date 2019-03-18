import { Component, OnInit } from '@angular/core';
import { ServerService } from "../server.service";

import { NgxPaginationModule } from 'ngx-pagination';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import * as Locglobal from '../GlobalLocvariableInterface';
import { GlobalLocvariable } from '../Globallocvariable';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
@Component({
  selector: 'app-expired-location',
  templateUrl: './expired-location.component.html',
  styleUrls: ['./expired-location.component.css']
})
export class ExpiredLocationComponent implements OnInit {

    urlForLocationDetails = "http://" + globalValues.ipAddress + "/cafeteriamanagement/locationdetailsadmin";
  urlToPostChanges = "http://" + globalValues.ipAddress + "/cafeteriamanagement/locationstatus";
  location_details: any[] = [];
  arrLocExpired: any[] = [];
  arrLocLive: any[] = [];
  sendLocid: any[] = [];

  metaData: any[] = [];
public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    }
  constructor(
    private serverService: ServerService,
      private notifier : NotificationsService,
      private LocserverService: ServerService,
       private spinnerService: SpinnerService,
       
private router:Router,

  ) { }

  ngOnInit() {
    this.spinnerService.show('mySpinner');
 this.serverService.getData(this.urlForLocationDetails)
      .subscribe(location_details => {
       
        this.metaData = location_details;
       
        for (let i = 0; i < this.metaData.length; i++) {
          if (this.metaData[i].status == "LIVE") {
            this.arrLocLive.push(this.metaData[i]);
          }
          if (this.metaData[i].status == "expired") {
            this.arrLocExpired.push(this.metaData[i]);
          }
        }

    this.sortArray(this.arrLocExpired);   
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

  Delete(id: any) {

   

    for (let i = 0; i < this.arrLocLive.length; i++) {
      if (this.arrLocLive[i].location_id === id) {
        this.arrLocLive.splice(i, 1);
        this.sendLocid.push({ "location_id": id })
      }
  
    }

    this.serverService.SaveData(this.urlToPostChanges, this.sendLocid)
      .subscribe(response => {

  if (response.operation === "successfull") {

          this.notifier.success("The Row has been successfully Deleted");

        }
        else {
          this.notifier.error("Data not Deleted!!!Cannot find the server");
        }

      });
      
  }
  //    LocRefresh() {
  //   this.location_details = [];
  //   this.arrLocExpired = [];
  //   this.arrLocLive = [];
  //   this.sendLocid = [];

  //   this.metaData = [];

  //   this.ngOnInit();
  // }
}
