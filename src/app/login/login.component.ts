import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as globalValues from "../Global-var-fun/globalVarFun";
import { ServiceService } from "../services/service.service";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[]
})
export class LoginComponent implements OnInit {
//Variables
  private loginForm:FormGroup;
  isClickedOnce : boolean = false;
//Urls
  urlForLogin='http://'+globalValues.ipAddress+'/cafeteriamanagement/login'

  constructor(private formBuilder:FormBuilder,
              private ServiceService:ServiceService,
              private router: Router,
              private spinnerService: SpinnerService ) 
              {}

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
      user_id:['',Validators.required],
      password:['',Validators.required]
    });
    
  }

//Function to login
  onSubmit(loginFormDetails:FormGroup){
    //service for login details
    this.ServiceService.postDataToServer(this.urlForLogin,loginFormDetails.getRawValue())
    .subscribe(res =>{ 
      // console.log(res)
    
      if(res.valid == "true" && res.status=="user"){
            localStorage.setItem('currentUser' ,loginFormDetails.getRawValue().user_id);
            localStorage.removeItem('StockAvailable');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('Quantity');
           this.router.navigate(['/navBar/home']);
        }
         else if(res.valid == "true" && res.status=="admin"){
           localStorage.setItem('adminUser' ,loginFormDetails.getRawValue().user_id);
           this.router.navigate(['/left-nav-bar/home-page']);
        }
          else{
        this.loginForm.setErrors({
         invalidLogin : true 
        })
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




