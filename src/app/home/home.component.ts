import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { Response, Http } from '@angular/http';
import { LoginService } from '../services/login.service';
import { Router } from "@angular/router";
import {Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import * as globalValues from "../Global-var-fun/globalVarFun";
import { SpinnerService } from "angular-spinners";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
//URLs   
  urlForLocationDetails = 'http://'+globalValues.ipAddress+'/cafeteriamanagement/locationdetails';
  urlForAdds = 'http://'+globalValues.ipAddress+'/cafeteriamanagement/getuserads';
//Arrays  
  location_details: any[];
  add_details : any[] = [];
//Variables  
  loc_id : string;


  constructor(private ServiceService : ServiceService,
              private router : Router,
              private spinnerService: SpinnerService,
              private http: Http) {

              }
 
  ngOnInit() 
  {
    //service for carousel
      this.spinnerService.show('mySpinner');      
      this.ServiceService.getDataFromServer(this.urlForAdds)
         .subscribe(add_details => {
           this.add_details=add_details;
           this.spinnerService.hide('mySpinner');
          },
          (error : AppError) =>{
            this.handleException(error);
          });

    //service for getting location details
      this.spinnerService.show('mySpinner');
      this.ServiceService.getDataFromServer(this.urlForLocationDetails)
         .subscribe(location_details => {
           this.location_details=location_details;
           this.spinnerService.hide('mySpinner');
          },
          (error : AppError) =>{
            this.handleException(error);
          }); 
  }

  //function to handle exceptions
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

setLocationDetails(location_name : string,location_id:string){
    localStorage.setItem("location_name",location_name);
    localStorage.setItem("location_id",location_id);

}

}



  

