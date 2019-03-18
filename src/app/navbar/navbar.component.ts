import { Component, OnInit} from '@angular/core';
import { ActivatedRoute ,Router,RouterLinkActive } from '@angular/router';
import { ServiceService } from "../services/service.service";
import * as globalValues from "../Global-var-fun/globalVarFun";
import {Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
    animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class NavbarComponent implements OnInit {
//URLs
  urlNavbar = "http://"+globalValues.ipAddress+"/cafeteriamanagement/getusername?user_id="+localStorage.getItem('currentUser');
//Arrays
  menus :any[];
//Variables  
  data: any;
  nameOfService : string;
  nameOfBuilding : string;
  nameOfVendor : string;
  nameOfCategory : string;
  idOfBuilding : any;
  idOfVendor : any;
  idOfService : any;
  idOfCategory : any;
  countCart : number;
  username : any;
  menuState:string = 'out';
  quan : number;
  static quantity: number;


     constructor(private route : ActivatedRoute,
                 private router : Router,
                 private ServiceService : ServiceService,
                 private spinnerService: SpinnerService,
                 private idle : Idle) {
                   
                  }

  ngOnInit() {
    //service for getting username
      this.ServiceService.getDataFromServer(this.urlNavbar)
      .subscribe(username => {
        this.username = username;
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

        this.countCart = globalValues.getValue();
        this.username = localStorage.getItem('currentUser');
        if(JSON.parse(localStorage.getItem("cartItems"))){
          globalValues.setItemArray(JSON.parse(localStorage.getItem("cartItems")));
        }
        NavbarComponent.quantity = globalValues.Items.length; 
        this.UdpateQuantity();
     }

//function to update the cart quantity
     UdpateQuantity(){
       NavbarComponent.quantity = globalValues.Items.length; 
     }

     get staticQuantity(){
       return NavbarComponent.quantity;
     }
//function for logOut
  logOut(){
    console.log("log out");
    // this.idle.stop();
    // this.idle.ngOnDestroy();
    globalValues.stock.splice(0);
    globalValues.setValue(0);
    globalValues.Items.splice(0);
    globalValues.quantity.splice(0);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('StockAvailable');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('Quantity');
  //  this.router.navigate(['/']);

  }
}
