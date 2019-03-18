import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { ServerService } from '../server.service';
import * as globalval from "../globalVar";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  urlForRegistration="http://"+globalval.ipAddress+"/cafeteriamanagement/userregistration";
  UserArray:any= {};
  UserForm: FormGroup;
  password:any;
   isClickedOnce : boolean = false;
  constructor(private router: Router,
  private notifier : NotificationsService,
    private serverService: ServerService,
      private spinnerService: SpinnerService
     
  ) {


  }
 public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    } 

  ngOnInit() {
    this.UserForm=new FormGroup({
                'firstname':new FormControl(null,[Validators.required,Validators.pattern('[A-Za-z]*')]),
                'lastname':new FormControl(null,[Validators.pattern('[A-Za-z]*')]),
                'email_id':new FormControl(null,[Validators.required]),
                'contact_number':new FormControl(null,[Validators.required,Validators.pattern('[0-9]*')]),
                'user_id': new FormControl(null,[Validators.required,Validators.pattern('[A-Za-z]+([A-Za-z0-9]+)*')]),
                'address':new FormControl(null,Validators.required),
                });
  }
Submit(UserForm)
{
  this.password=this.generatepwd();
  this.UserArray={
                'firstname':this.UserForm.value.firstname,
                'lastname':this.UserForm.value.lastname,
                'email_id':this.UserForm.value.email_id,
                'contact_number':this.UserForm.value.contact_number,
                'user_id':this.UserForm.value.user_id,
                'password':this.password,
                'address':this.UserForm.value.address
  };
               this.serverService.SaveData(this.urlForRegistration,this.UserArray)
                                          .subscribe(response =>{
                                    
                                            if(response.user==="added" || response.user==="Mailer Exception"){
                                              this.notifier.success("User Registration Successful");
                                              this.UserForm.reset();
                                            

                                            }
                                              else if(response.user==="user_id already exists"){
                                                this.notifier.error("User ID already exists");
                                                this.isClickedOnce=false;
                                                this.UserForm.reset();
                                                }
                                              else if(response.user=="email_id already exists"){
                                                this.notifier.error("Email-id already exists");
                                                        this.isClickedOnce=false;
                                                        this.UserForm.reset();
                                                }
                                              else{
                                              this.notifier.error("User Registration Failed, Please try again");
                                              this.UserForm.reset();
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
}
