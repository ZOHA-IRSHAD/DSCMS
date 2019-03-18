
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { ServerService } from '../server.service';
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  urlUser = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/usrdetails ';
  // urlUserStatus = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/vendorstatus';
  Users_details: any[] = [];
  arrUserLive: any[] = [];
  arrcomplete: any[] = [];
  sendid: any[] = [];

 p: number = 1;//pagination

  metaData: any[] = [];

ResetForm:FormGroup;
  constructor(private serverService: ServerService,
    private notifier : NotificationsService,
    private router:Router,
    private spinnerService:SpinnerService) { }
    
    public options = {
    position: ["top", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    } 

  ngOnInit() {

      this.ResetForm = new FormGroup({
        'user_id':new FormControl(null, [Validators.required,Validators.pattern('[A-Za-z]+([A-Za-z0-9]+)*')]),
      });

    this.serverService.getData(this.urlUser)
      .subscribe(Users_details => {
     

        this.metaData = Users_details;

      
        for (let i = 0; i < this.metaData.length; i++) {
            this.arrUserLive.push(this.metaData[i]);
          
          // else if (this.metaData[i].status === "expired") {
          //   this.arrcomplete.push(this.metaData[i]);
          // }
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

  

  Delete(id: any) {

  

    for (let i = 0; i < this.arrUserLive.length; i++) {
      if (this.arrUserLive[i].user_id === id) {
        this.arrUserLive.splice(i, 1);
        this.sendid.push({ "user_id": id })
      }
    }

    // this.serverService.SaveData(this.urlUserStatus, this.sendid)
    //   .subscribe(response => {
 


    //     if (response.operation == "successfull") {

    //        this.vendorRefresh();
    //       this.notifier.success("The Row has been successfully Deleted!!!");

    //     }
    //     else {
    //        this.notifier.error("Data not Deleted!!!Cannot find the server");
    //       // alert();
    //     }

    //   });
     
  }
  ResetPwd(ResetForm){

    
        // this.serverService.SaveData(this.urlUserStatus, this.sendid)
    //   .subscribe(response => {




    //     if (response.operation == "successfull") {

    //        this.vendorRefresh();
    //       this.notifier.success("The Row has been successfully Deleted!!!");

    //     }
    //     else {
    //        this.notifier.error("Data not Deleted!!!Cannot find the server");
    //       // alert();
    //     }

    //   });

  }
  Restore(id:any){

  }


  vendorRefresh() {
    this.Users_details = [];
    this.arrUserLive = [];
    // this.arrcomplete = [];
    // this.sendid = [];
    this.metaData = [];
    this.ngOnInit();
    //  window.location.reload();
  }

  
}


