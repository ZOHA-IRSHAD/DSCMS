import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server.service';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-expired-vendor',
  templateUrl: './expired-vendor.component.html',
  styleUrls: ['./expired-vendor.component.css']
})
export class ExpiredVendorComponent implements OnInit {

  urlVendor = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/vendordetailsadmin';
  urlVendorStatus = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/vendorstatus';
   today: string;

  arrcomplete: any[] = [];
  sendid: any[] = [];

 p: number = 1;//pagination

  metaData: any[] = [];

  constructor(private serverService: ServerService,
    private notifier : NotificationsService,
 
private router:Router,
private spinnerService: SpinnerService ) { }
    
    public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    } 
  

  ngOnInit() {
     var displayDate = new Date().toLocaleDateString();
    this.today = displayDate;
this.spinnerService.show('mySpinner');
      this.serverService.getData(this.urlVendor)
      .subscribe(vendors_details => {
    

        this.metaData = vendors_details;

       
        for (let i = 0; i < this.metaData.length; i++) {
          if (this.metaData[i].status === "expired" || this.metaData[i].status==="terminated" ||this.metaData[i].status==="suspended") {
            this.arrcomplete.push(this.metaData[i]);
          }
        }
        this.sortArray(this.arrcomplete);
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


