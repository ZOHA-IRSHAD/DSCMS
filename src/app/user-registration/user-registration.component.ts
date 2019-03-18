import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule,AbstractControl} from '@angular/forms';
import { RouterModule,Routes,Router} from '@angular/router';
import { ServiceService } from "../services/service.service";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
//URLs  
 urlForRegistration="http://"+globalValues.ipAddress+"/cafeteriamanagement/userregistration";
//Variables
 public glob;
 RegistrationForm:FormGroup;
 status: string;
 isClickedOnce : boolean = false;

  public options = {
    position: ["top", "right"],
    showProgressBar : false,
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    }   

   constructor(private ServiceService : ServiceService,
               private router:Router,
               private notifier : NotificationsService,
               private spinnerService: SpinnerService,)
                { 
    
       
   }



  ngOnInit() {
      this.RegistrationForm=new FormGroup({
                'firstname':new FormControl(null,[Validators.required,Validators.pattern('[A-Za-z]*')]),
                'lastname':new FormControl(null,[Validators.pattern('[A-Za-z]*')]),
                'email_id':new FormControl(null,[Validators.required]),
                'contact_number':new FormControl(null,[Validators.required,Validators.pattern('[0-9]*')]),
                'user_id': new FormControl(null,[Validators.required,Validators.pattern('[A-Za-z]+([A-Za-z0-9]+)*')]),
                'password':new FormControl(null,Validators.required ),
                'Confirmpassword':new FormControl(null,[Validators.required]),
                'address':new FormControl(null,Validators.required),
                });

  }

    matchingPasswords = (control: AbstractControl) =>{

    const newPassword = control.get('password');
    const confirmPassword = control.get('Confirmpassword');
    
    if (!newPassword || !confirmPassword) {
      return null;
    }
  
    return( newPassword.value == confirmPassword.value )? {mismatchedPasswords: false} : { mismatchedPasswords: true };
  
}
// function for getting current date
getDate()
{
        var dateObj = new Date();
        var month, day,year: any;
        month = dateObj.getUTCMonth() + 1; //months from 1-12
        if(month<10)
          month = "0" + month;
        day = dateObj.getUTCDate();
        if(day<10)
          day= "0" + day;
        year = dateObj.getUTCFullYear();
        var today =day + "/" + month + "/" + year;
        return today;
}
//  function for submit the form    

   onSubmit()
    {
      this.glob = this.RegistrationForm.value;
      this.glob.date=this.getDate();
//  service for post the form details
      this.ServiceService.postDataToServer(this.urlForRegistration,this.glob)
                                          .subscribe(response =>{
                                    
                                            if(response.user==="added" || response.user==="Mailer Exception"){
                                              this.notifier.success("User Registration Successfull");
                                              setTimeout((router: Router) => {
                                                    this.router.navigate(['/']);
                                                }, 2000);

                                            }
                                              else if(response.user==="user_id already exists"){
                                                this.notifier.error("User ID already exists");
                                                this.isClickedOnce=false;
                                                }
                                              else if(response.user=="email_id already exists"){
                                                this.notifier.error("Email-id already exists");
                                                        this.isClickedOnce=false;
                                                }
                                              else{
                                              this.notifier.error("User Registration Failed, Please try again");
                                              this.RegistrationForm.reset();
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
//function for reset the form
ResetForm(){
    this.RegistrationForm.reset();
 }
}


