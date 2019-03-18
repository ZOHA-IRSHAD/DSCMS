import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ServiceService } from "../services/service.service";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
//Variables
   ForgotForm:FormGroup;
   data :any;
   isClickedOnce : boolean = false;
//Urls
   urlForgot : string = "http://"+globalValues.ipAddress+"/cafeteriamanagement/forgotpassword";
   
    public options = {
    position: ["top", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    showProgressBar : false,
    preventDuplicates : true,
    }   
  
  constructor(private ServiceService : ServiceService,
              private router : Router,
              private notifier : NotificationsService,
              private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.ForgotForm = new FormGroup({
      'user_id':new FormControl(null,[Validators.required])
      });

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

//function to submit the form values and reset the password
onSubmit(){
  var user_id=this.ForgotForm.getRawValue().user_id;
  var pwd = this.generatepwd();

  this.data = {"user_id":user_id,
               "password" : pwd};

//service for resetting the password
  this.ServiceService.postDataToServer(this.urlForgot,this.data)
                                      .subscribe(res=>{
                                        if(res.link == "sent"){
                                           this.notifier.success("An auto-generated password has been mailed to you");
                                           setTimeout((router: Router) => {
                                                    this.router.navigate(['/']);
                                                }, 2000);
                                        }
                                        else{
                                          this.ForgotForm.setErrors({
                                                invalidUser : true 
                                                });
                                              this.isClickedOnce=false;
                                        }
                                      },
                                      (error : AppError) =>{
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
                                              });
}
}
