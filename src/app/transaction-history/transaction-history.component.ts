import { Component, OnInit } from '@angular/core';
import { ServiceService } from "../services/service.service";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { ItemsOfOrder } from "../Interfaces/items-of-order";
import { Vendoranditemsinterface } from "../Interfaces/Vendoranditemsinterface";
import { EventEmitter } from '@angular/core';
import { ItemsOfFeedback } from "../Interfaces/items-of-feedback";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { SpinnerService } from "angular-spinners";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  username = localStorage.getItem('currentUser');
//URLs
  urlForRecent = "http://"+globalValues.ipAddress+"/cafeteriamanagement/"+this.username+"/orderdetails?order_status=active" ;
  urlForHistory = "http://"+globalValues.ipAddress+"/cafeteriamanagement/"+this.username+"/orderdetails?order_status=completed"; 
  urlForPostingFeedback = "http://"+globalValues.ipAddress+"/cafeteriamanagement/feedback";
  urlForFetchingPreviousFeedback = "http://"+globalValues.ipAddress+"/cafeteriamanagement/"+this.username+"/feedback";
//Arrays  
  detailsOfRecentOrders : any[];
  detailsOfHistoryOrders : any[];
  detailsOfPreviousFeedback : any[] = [];
  vendorNameAndItemsArray :Array<Vendoranditemsinterface>=[];
  vendorsArray : string[] = [];
  RecentOrders : any[] = [];
  history : any[];
  tempItems : any[] = [];
  vendorRatings : any[] = [];
  itemRating : Array<ItemsOfFeedback> = [];
  feedbackData : {};
  remarksTextValue : any[] = [];
  feedbackLocal : any[] = [] ;
//Variables    
  feedbackButtonactive : boolean=true;
  feedbackDate : any;
  checkOrderHistory : boolean =false;
  checkOrderRecent : boolean =false;
  rating : number;
  page=1;
  page1=1;



  constructor(
              private ServiceService : ServiceService,
              private router : Router,
              private spinnerService: SpinnerService  ) { }

  ngOnInit() {
// service for recent order details    
    this.spinnerService.show('mySpinner');
    this.ServiceService.getDataFromServer(this.urlForRecent)
                       .subscribe(detailsOfRecentOrders => {
                             this.detailsOfRecentOrders = detailsOfRecentOrders ;
                             this.spinnerService.hide('mySpinner');
                             if(this.detailsOfRecentOrders.length > 0){
                               this.checkOrderRecent =true;
                             }
                              this.sortArray(this.detailsOfRecentOrders);
                      
                          },
          (error : AppError) =>{
            this.handleException(error);
          });
// service for history order details                            
    this.spinnerService.show('mySpinner');
    this.ServiceService.getDataFromServer(this.urlForHistory)
                       .subscribe(detailsOfHistoryOrders =>{
                             this.detailsOfHistoryOrders = detailsOfHistoryOrders ;
                             this.spinnerService.hide('mySpinner');
                             if(this.detailsOfHistoryOrders.length > 0){
                               this.checkOrderHistory = true;
                             }
                              this.sortArray(this.detailsOfHistoryOrders);
                          },
          (error : AppError) =>{
            this.handleException(error);
          });
// service for history order details                            
    this.spinnerService.show('mySpinner');
    this.ServiceService.getDataFromServer(this.urlForFetchingPreviousFeedback)
                       .subscribe(detailsOfPreviousFeedback =>{
                           this.detailsOfPreviousFeedback = detailsOfPreviousFeedback ;
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
      
  
// function to get unique vendors of the order and link their food items
getVendorArray( items: ItemsOfOrder[])
{
    for(let i=0;i<items.length;i++){
        this.remarksTextValue[i]=' ';
    }
    this.vendorNameAndItemsArray.splice(0);
      this.vendorsArray.splice(0);
      var present =false;

      for(var i=0;i< items.length; i++){
        for(var j=0; j< this.vendorsArray.length; j++){
          if(items[i].vendor_name==this.vendorsArray[j]){
                present = true;
          }
        }
        if(present==false){
          this.vendorsArray.push(items[i].vendor_name);
        }
        else
          present=false;
      }
      
    for(let index=0; index <this.vendorsArray.length; index++){
      this.tempItems = [];
        for(let k=0; k<items.length ; k++){
          if(this.vendorsArray[index]==items[k].vendor_name){
            this.tempItems.push(items[k].item_name)
          }
        }
        this.vendorNameAndItemsArray.push({"vendor_name" : this.vendorsArray[index],
                                            "items_name" : this.tempItems}
                                          );  
      }
      for(let i=0; i<items.length; i++)
        {
          this.itemRating.push({"vendor_id":"","vendor_name": "","item_id":"","item_name":"","category_id": "","quality_of_service":"", "quality_of_food" : "","remarks": "", "serving_id":""});
        }

  }

//function to stor vendor rating
    setVendorRating(vendor : string , value :number){
      var present: boolean=false;
      if(this.vendorRatings.length > 0){
        for(let i = 0;i < this.vendorRatings.length;i++){
          if(this.vendorRatings[i].vendor == vendor){
            this.vendorRatings[i].rating = value;
            present=true;
            break;
          }
        }
        if(present==false)
          {
            this.vendorRatings.push({"vendor": vendor, "rating" : value});
          }
      }else{
      this.vendorRatings.push({"vendor": vendor, "rating" : value});
      
    }
    if(this.itemRating.length>0){
      for(let i=0; i <this.vendorRatings.length; i++){
        for(let j=0; j <this.itemRating.length;j++){
          if(this.vendorRatings[i].vendor==this.itemRating[j].vendor_name){
            this.itemRating[j].quality_of_service=this.vendorRatings[i].rating;
          }
        }
      }
    }
    this.fbButtonActive();
    }
  
 //function to store ratings of items 
    setItemRating(vendor_id: number,vendor_name: string,item_id:number,item_name : string, category_id: string,serving_id: string, quality_of_food : number, i :number){
      var temp_qos : number ;
       var present: boolean=false;
       for(let j=0; j<this.vendorRatings.length; j++){
         if(this.vendorRatings[j].vendor==vendor_name){
           temp_qos = this.vendorRatings[j].rating;
         }
       }
            
            this.itemRating[i].vendor_id = vendor_id.toString();
            this.itemRating[i].vendor_name = vendor_name;
            this.itemRating[i].item_id = item_id.toString();
            this.itemRating[i].item_name = item_name;
            this.itemRating[i].category_id = category_id;
            if(temp_qos)
              this.itemRating[i].quality_of_service = temp_qos.toString();
            this.itemRating[i].quality_of_food = quality_of_food.toString();
            this.itemRating[i].remarks = this.remarksTextValue[i];
            this.itemRating[i].serving_id = serving_id;
            this.fbButtonActive();
    }

  //function to post feedback to server
    submitFeedback(order_id:string,user_id: string){
        var dateObj = new Date();
        var month, day,year : any;
        month = dateObj.getUTCMonth() + 1; //months from 1-12
        if(month<10)
          month = "0" + month;
        day = dateObj.getUTCDate();
        if(day<10)
          day= "0" + day;
        year = dateObj.getUTCFullYear();
        this.feedbackDate =day + "/" + month + "/" + year;

      this.feedbackData = {"order_id" : order_id,
                           "user_id" : user_id,
                           "date" : this.feedbackDate,
                           "item" : this.itemRating} ;
                           
      for(let i=0;i< this.itemRating.length; i++){
        this.itemRating[i].remarks = this.remarksTextValue[i]; 
      }
      //service to post feedback
      this.ServiceService.postDataToServer(this.urlForPostingFeedback,this.feedbackData)
                         .subscribe(response =>{
                          this.feedbackLocal.push(order_id);
                          this.clearData();
                          if(response.add=="successful"){
                          }
                        },
          (error : AppError) =>{
            this.handleException(error);
          });
    }
  form = new FormGroup
  ({
    rating : new FormControl()
  })

  //function to clear arrays storing ratings
    clearData(){
    
      this.vendorRatings=[];
      this.itemRating=[];
      this.feedbackButtonactive=true;
      this.form.reset();
    }

    //function to store remarks of each item
   remarks(index : number){
      this.remarksTextValue[index]=this.remarksTextValue[index];
    }

    //function to check whether feedback is already given
    isFeedbackGiven(order_id:string){
      if(this.detailsOfPreviousFeedback.length==0){
        return false;
      }
      else{
        for(var i=0; i<this.detailsOfPreviousFeedback.length; i++){
          if(this.detailsOfPreviousFeedback[i].order_id==order_id){
            return true;
          }
        }
        for(let i=0; i<this.feedbackLocal.length;i++){
          if(this.feedbackLocal[i] == order_id){
            return true;
          }
        }
      }
    }

    //function to enable/disable the feedback button
    fbButtonActive(){
      let count = this.itemRating.length;
      for(let i=0;i<this.itemRating.length;i++){
        if(this.itemRating[i].quality_of_food!="" && this.itemRating[i].quality_of_service!=""){
            count--;
        }
      }
      if(count==0){
        this.feedbackButtonactive=false;
      }
    }

//function to sort array in chronological order
sortArray(array: any[]){
  array.sort(function (a, b) {
                                    var tdate1 = a.date;
                                    var parts1 = tdate1.split("/");
                                    var date1 =parts1[1] + "/" + parts1[0] + "/" + parts1[2];
                                    var time1 = a.transaction_time;


                                    var tdate2 = b.date;
                                    var parts2 = tdate2.split("/");
                                    var date2 =parts2[1] + "/" + parts2[0] + "/" + parts2[2];
                                    var time2 = b.transaction_time;
                                    if(parts1[2]<parts2[2]){
                                      return 1;
                                    }
                                    else if(parts1[2] == parts2[2]){
                                            if (date1 < date2) {
                                                return 1;
                                            } else if (date1 == date2) {
                                            if(time1 < time2){
                                              return 1;
                                            } else if(time1 == time2){
                                              return 0;
                                            } else{
                                              return -1;
                                            }    
                                            } else {
                                              return -1;
                                            }
                                    }
                                  else return -1;
                                });
}
}