
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

import { OrderByPricePipe } from "../filters/OrderByPrice.pipe";
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-live-user',
  templateUrl: './live-user.component.html',
  styleUrls: ['./live-user.component.css']
})
export class LiveUserComponent implements OnInit {
  arrUserLiveSort: any[];
  restpwdarray: any;
  password: any;
  id: string;

  urlUser = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/usrdetails ';
urlUserStatus='http://' + globalValues.ipAddress + '/cafeteriamanagement/changeuserstatus';
urlrestpwd='http://' + globalValues.ipAddress + '/cafeteriamanagement/forgotpassword';
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
    private spinnerService: SpinnerService 	) { }
    
    public options = {
    position: ["bottom", "right"],
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
  this.spinnerService.show('mySpinner');
    this.serverService.getData(this.urlUser)
      .subscribe(Users_details => {
     

        this.metaData = Users_details;

      
        for (let i = 0; i < this.metaData.length; i++) {
          if(this.metaData[i].status==='active'){
            this.arrUserLive.push(this.metaData[i]);}
 }
        // this.arrUserLive.sort(function(a,b)=>{

        // });     
this.sortArray(this.arrUserLive)

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

    
this.id=id;
    for (let i = 0; i < this.arrUserLive.length; i++) {
      if (this.arrUserLive[i].user_id === this.id) {
       this.arrUserLive.splice(i,1);
        this.sendid.push({ "user_id": id });
      }
    }

    this.serverService.SaveData(this.urlUserStatus,this.sendid)
      .subscribe(response => {
     
        if (response.response == "status changed to inactive") {
            this.notifier.success("The User has been successfully Deleted!!!");

        }
        else {
           this.notifier.error("Data not Deleted!!!Cannot find the server");
          // alert();
        }

      });
     this.sendid=[];  
  }
    //Function to generate unique password
  generatepwd()
  {
        var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*+ABCDEFGHIJKLMNOP1234567890";
        var lengthOfNewPassword=10;
         var pass="";
        for (var x = 0; x < lengthOfNewPassword; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
  }
  ResetPwd(ResetForm){

    this.password=this.generatepwd();
    this.restpwdarray={
      'user_id':this.ResetForm.value.user_id,
      'password':this.password
    }
   
    
      //   this.serverService.SaveData(this.urlUserStatus, this.sendid)
      // .subscribe(response => {




    //     if (response.operation == "successfull") {

    //        this.vendorRefresh();
    //       this.notifier.success("The Row has been successfully Deleted!!!");

    //     }
    //     else {
    //        this.notifier.error("Data not Deleted!!!Cannot find the server");
    //       // alert();
    //     }

      // });

  }
  
   
 


 

  
}


