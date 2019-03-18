import { Component, OnInit } from '@angular/core';
import { User } from "../Interfaces/user-p";
import { ServiceService } from "../services/service.service";
import { Router } from "@angular/router";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";



@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
//Variables
  public user: User;
  urlToChangePassword : string ;
  userName : string ; 
  data : any;

  constructor(private ServiceService : ServiceService,
              private router: Router,
              private notifier : NotificationsService,
              private spinnerService: SpinnerService) { }

  public options = {
    position: ["top", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    }   


ngOnInit() 
{
    this.user = {
      oldpassword: '',
      password: '',
      confirmPassword: ''
    }
    this.userName= localStorage.getItem('currentUser');

  }
 
//function for post the data to DB
  save(model: User) {
  
    this.urlToChangePassword = "http://"+globalValues.ipAddress+"/cafeteriamanagement/"+this.userName+"/changepassword"; 
    this.data = {"oldPassword" : model.oldpassword,
                 "newPassword" : model.password}; 
// service for post the data   
       this.ServiceService.postDataToServer(this.urlToChangePassword,this.data)
                                          .subscribe(response=>{
                                            if(response.status=="password changed successfully"){
                                              this.notifier.success("password changed successfully");
                                           setTimeout((router: Router) => {
                                                    this.router.navigate(['/']);
                                                }, 2000);
                                            }
                                              else {
                                              this.notifier.error("password doesn't match");
                                              this.router.navigate(['/navBar/passwordchange']);  
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
