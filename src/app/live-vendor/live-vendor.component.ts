import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../server.service';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl, NgForm } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-live-vendor',
  templateUrl: './live-vendor.component.html',
  styleUrls: ['./live-vendor.component.css']

})
export class LiveVendorComponent implements OnInit {
  // @ViewChild('f') terminatedform:NgForm;
  // @ViewChild('f2') suspendedform:NgForm;
urlVendor = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/vendordetailsadmin';
  urlVendorStatus = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/vendorstatus';
   today: string;
  arrLive: any[] = [];
  arrcomplete: any[] = [];
  sendid: any[] = [];
selectedlink:any;
 p: number = 1;//pagination

  metaData: any[] = [];
FromDate:any;
ToDate:any;
Reason:any;
Reason1:any;
Suspended:any;

  constructor(private serverService: ServerService,
    private notifier : NotificationsService,
  

private router:Router,
private spinnerService: SpinnerService 	) { }
    // navs = ['Terminated', 'Suspended'];
    public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    } 
  FormValues:FormGroup;
selectedNav: any;
//  regTypeSelectedOption: string = "";
  ngOnInit() {

    var displayDate = new Date().toLocaleDateString();
    this.today = displayDate;
this.spinnerService.show('mySpinner');
      this.serverService.getData(this.urlVendor)
      .subscribe(vendors_details => {
 

        this.metaData = vendors_details;


        for (let i = 0; i < this.metaData.length; i++) {
          if (this.metaData[i].status === "LIVE") {
            this.arrLive.push(this.metaData[i]);
          }
          // else if (this.metaData[i].status === "expired" || this.metaData[i].status==="terminated" ||this.metaData[i].status==="suspended") {
          //   this.arrcomplete.push(this.metaData[i]);
          // }
        }
        // console.log(this.arrLive);
        this.sortArray(this.arrLive);
        // console.log(this.arrLive);
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
  setradio(variable){

this.selectedlink=variable;
}
isSelectedLink(name: string)
{
  if (!this.selectedlink) { // if no radio button is selected, always return false so every nothing is shown  
            return false; }
            return(this.selectedlink===name);
}
// Submit(form:NgForm){
//   console.log(this.Reason);
// }


  Delete(form:NgForm,id: string) {


// console.log(this.Reason)
// console.log(id)

 if(this.selectedlink==="Terminated")
  {
     for (let i = 0; i < this.arrLive.length; i++) {
       if (this.arrLive[i].vendor_id === id) {
         this.arrLive.splice(i, 1);
        this.sendid.push({ "vendor_id": id,"status":"terminated","comments":this.Reason})
      }
      
    }
    // console.log(this.sendid);
  }
   else 
     if(this.selectedlink==="Suspended"){
    for (let i = 0; i < this.arrLive.length; i++) {
      if (this.arrLive[i].vendor_id === id) {
        this.arrLive.splice(i, 1);
        this.sendid.push({ "vendor_id": id,"status":'suspended',"from_Date":this.FromDate,"to_Date":this.ToDate,"comments":this.Reason1})
      }
      
    }
    // console.log(this.sendid);
  }
  
   

   
    this.serverService.SaveData(this.urlVendorStatus, this.sendid)
      .subscribe(response => {
     



        if (response.operation == "successfull") {
         
          this.notifier.success("The Row has been successfully Deleted!!!");

        }
        else {
           this.notifier.error("Data not Deleted!!!Cannot find the server");
          // alert();
        }
        (error : AppError) =>{
 
          this.handleException(error);}

      });
     this.sendid=[];
    //  this.ClearData();
  }
  
  

// setNav(nav:any){
//       this.selectedNav = nav;
//       console.log(nav);
// 			if(this.selectedNav === "Terminated"){
// 				this.regTypeSelectedOption = "Terminated";
// 			}
// 			else if(this.selectedNav === "Suspended"){
// 				this.regTypeSelectedOption = "Suspended";
// 			}
	
// 		}

  
//   ClearData()
//   {
// this.FromDate=[];
// this.ToDate=[];
// this.Reason=[];
//   }
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


