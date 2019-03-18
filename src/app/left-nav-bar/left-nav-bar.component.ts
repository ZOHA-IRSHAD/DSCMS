import { Component, OnInit } from '@angular/core';
import { ServerService }from '../server.service';

import {Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router,RouterLinkActive} from "@angular/router";

import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";

@Component({
  selector: 'app-left-nav-bar',
  templateUrl: './left-nav-bar.component.html',
  styleUrls: ['./left-nav-bar.component.css']
})
export class LeftNavBarComponent implements OnInit {
username:any;
Name:string;

  constructor(private servercall:ServerService,
   private idle : Idle,


  private router:Router,
  private spinnerService: SpinnerService 	) { }

  ngOnInit() {
this.servercall.getData("http://"+globalValues.ipAddress+"/cafeteriamanagement/getusername?user_id="+ localStorage.getItem("adminUser")).subscribe(res =>{
  this.username=res;
this.Name=this.username;

(error : AppError) =>{
 
  this.handleException(error);}
})
    
  }
 logOut(){
    this.idle.stop();
    this.idle.ngOnDestroy();
    localStorage.removeItem('adminUser');
    globalValues.setValue(0);
    globalValues.Items.splice(0);
    globalValues.quantity.splice(0);
    this.router.navigate(['/']);
 
  
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
