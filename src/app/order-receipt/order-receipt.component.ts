import { Component, OnInit } from '@angular/core';
import { ServiceService } from "../services/service.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import {Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { SpinnerService } from "angular-spinners";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";



@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.component.html',
  styleUrls: ['./order-receipt.component.css']
})
export class OrderReceiptComponent implements OnInit {
  //Variables
  nameOfService : string;
  nameOfBuilding : string;
  nameOfVendor : string;
  nameOfCategory : string;
  idOfBuilding : any;
  idOfVendor : any;
  idOfService : any;
  idOfCategory : any;
  data: any;
  orderDetails :any;
  username : any;
  //urls
  urlForOrderDetails : any;


  constructor(private ServiceService : ServiceService,
              private route : ActivatedRoute,
              private router : Router,
              private spinnerService: SpinnerService) {}

ngOnInit(){
  this.username= localStorage.getItem('currentUser');
  this.urlForOrderDetails ='http://'+globalValues.ipAddress+'/cafeteriamanagement/'+this.username+'/'+globalValues.orderId.toString()+'/orderdetails';

  //service for order details
    this.spinnerService.show('mySpinner');
    this.ServiceService.getData(this.urlForOrderDetails)
                          .subscribe(orderDetails =>{
                             this.orderDetails = orderDetails;
                             this.spinnerService.hide('mySpinner');
                          
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
