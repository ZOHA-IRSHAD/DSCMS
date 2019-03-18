
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
  selector: 'app-expired-user',
  templateUrl: './expired-user.component.html',
  styleUrls: ['./expired-user.component.css']
  
})
export class ExpiredUserComponent implements OnInit {
restpwdarray:any ;
  password: any;
  id: string;

  urlUser = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/usrdetails ';
urlUserStatus='http://' + globalValues.ipAddress + '/cafeteriamanagement/changeuserstatus';
urlrestpwd='http://' + globalValues.ipAddress + '/cafeteriamanagement/forgotpassword';
  Users_details: any[] = [];
  arrUserexp: any[] = [];
  arrcomplete: any[] = [];
  sendid: any[] = [];

 p: number = 1;//pagination

  metaData: any[] = [];

ResetForm:FormGroup;
  constructor(private serverService: ServerService,
    private notifier : NotificationsService,
    private router:Router,
    private spinnerService: SpinnerService) { }
    
    public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    } 
  ngOnInit() {
    this.spinnerService.show('mySpinner');
    this.serverService.getData(this.urlUser)
      .subscribe(Users_details => {
       

        this.metaData = Users_details;


        for (let i = 0; i < this.metaData.length; i++) {
          if(this.metaData[i].status==='inactive'){
            this.arrUserexp.push(this.metaData[i]);}
 }
    this.sortArray(this.arrUserexp);
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

     Resetuser(id: any) {

   
this.id=id;
    for (let i = 0; i < this.arrUserexp.length; i++) {
      if (this.arrUserexp[i].user_id == id) {
        this.arrUserexp.splice(i, 1);
        this.sendid.push({ "user_id": id });
      }
    }
  
    this.serverService.SaveData(this.urlUserStatus,this.sendid)
      .subscribe(response => {
      



        if (response.response == "status changed to active") {
            this.notifier.success("The User has been successfully Restored!!!");

        }
        else {
           this.notifier.error("Data not Deleted!!!Cannot find the server");
        
        }
        (error : AppError) =>{
 
          this.handleException(error);}

      });
     this.sendid=[];
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
