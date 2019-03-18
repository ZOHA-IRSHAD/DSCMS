import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ServerService } from '../server.service';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  Colors:any[];
  datatablenonveg: any[] = [];
  category_val: any[] = [];
  Categories: any[]=[];
  Categ: any[] = [];
  Serving_info: any[] = [];
  TOS: any[] = [];
  datatableveg: any[] = [];
  service_val:any;
  vendor_val:any;
  vendor_data: any[] = [];
  doughnutChartDatadata: any[] = [];
  doughnutChartLabelsdata: any[]=[];
  // dougnutdata: any[]=[];
  serving_info:any[];
  datadough: any[] = [];
  dataset: any[] = [];
  week:any[]=[];
  registered_user: any;
  addFeed: number;
  date: string;
  active_users_today: any;
  orders_today: any;
  days:any[]=[];
  dates:any[]=[];
  data:any[]=[];
  vendor_info:any[]=[];
  feedback:any[]=[];
  bardatas:any[]=[];
  infodata:any[];
linechartUrl='http://'+ globalValues.ipAddress +'/cafeteriamanagement/presentweekfeedback';
barchart='http://'+ globalValues.ipAddress +'/cafeteriamanagement/topcategoryitems';
dougnutchart='http://'+ globalValues.ipAddress +'/cafeteriamanagement/topvendors';
 UrlService='http://'+globalValues.ipAddress+'/cafeteriamanagement/timeofservicedetails';
 urlStatistics='http://' + globalValues.ipAddress + '/cafeteriamanagement/getstatistics';
 UrlCategory='http://'+globalValues.ipAddress+'/cafeteriamanagement/categorydetails';
  constructor(private dataserverService: ServerService,
  
private router:Router,
private spinnerService: SpinnerService ) { }
 public lineChartData:Array<any> = [];
  public lineChartColors:Array<any> = [];
  public lineChartLabels:Array<any> = [];
  public lineChartOptions:any = {
    legend: {position: 'right'},
    responsive: true,
    scaleShowValues: true,
scaleValuePaddingX: 10,
scaleValuePaddingY: 10,
  };
  // 
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  //dougnut
   public doughnutChartLabels:string[] = [];
  public doughnutChartData:number[] = [];
  public doughnutChartType:string = 'doughnut';
    public chartColors:any[]= [];
  //Horizontal Bar Chart
  public barChartData:Array<any> = [];
  public barChartLabels:Array<any>;
    public barChartOptions:any = {
    responsive: true,
    scaleShowValues: true,
scaleValuePaddingX: 10,
scaleValuePaddingY: 10,
  };
  // 
  public barChartLegend:boolean = true;
   public barChartType: string = 'bar';
   public barChartColors:string;
 
  ngOnInit() {
          this.dataserverService.getData(this.UrlCategory)
.subscribe((Cat)=>{
 
  this.Categ=Cat;

   for(let i=0;i<this.Categ.length;i++)
  {
    this.Categories.push({"cat_id":this.Categ[i].cat_id,"cat_name":this.Categ[i].cat_name})
  }
       });


    this.dataserverService.getData(this.UrlService)
  
.subscribe((timeofservice)=>{
   this.TOS=timeofservice;

   for(let i=0;i<this.TOS.length;i++)
  {
    this.Serving_info.push({"serving_name":this.TOS[i].service_name,"serving_id":this.TOS[i].service_id})
  }
  

(error : AppError) =>{
 
  this.handleException(error);}
      });

    this.dataserverService.getData(this.urlStatistics)
      .subscribe(
      (statdata) => {
        this.registered_user=statdata.users_registered_today;
        this.orders_today = statdata.order_count_today//Today's Orders
        this.addFeed = +statdata.daily_non_veg_feedback_count + +statdata.daily_veg_feedback_count;//Todays Feedback
        this.active_users_today = statdata.active_user_count_today;//Today's active users


      }
      );
    var displayDate = new Date().toLocaleDateString();
    this.date = displayDate;
    this.dataserverService.getData(this.linechartUrl).subscribe(
      (dataset)=>{
         if (!dataset) {
   alert("No data returned");
         
        }
        else { 
          
          this.dataset=dataset;
 
          for (let i = 0; i < this.dataset.length; i++) {
             
            for (let j = 0; j < this.dataset[i].weeklyFeedbacks.length; j++) {
              this.week.push(this.dataset[i].weeklyFeedbacks[j]);

            }
            
          } 
       
          for (let i=0;i<this.week.length;i++)
            {
              this.days.push(this.week[i].date);
              
            }
        
             this.dates = Array.from(new Set(this.days));

             this.lineChartLabels=this.dates;

           
          
              for (let i = 0; i < this.dataset.length; i++) {
                 
            this.feedback = [];
             
            for (let j = 0; j < this.dataset[i].weeklyFeedbacks.length; j++) {
               
              this.feedback.push(this.dataset[i].weeklyFeedbacks[j].feedback);
              
            }
         
            this.data.push({ "data": this.feedback, "label": this.dataset[i].vendor_name });
             this.vendor_info.push({"vendor_id":this.dataset[i].vendor_id,"vendor_name":this.dataset[i].vendor_name});
          //  this.lineChartColors[0].backgroundColor.push(this.random_rgba());
            }
             
            
         
        }
        this.lineChartData=this.data;
        

(error : AppError) =>{
 
  this.handleException(error);}
        //  this.lineChartColors[0].backgroundColor.push(this.getRandomRolor());
      }
    );

    //horizontal bar charts
 this.dataserverService.getData(this.barchart).subscribe(
         (bardata)=>{
           this.bardatas=bardata
           
          
           for(let i=0;i<this.bardatas.length;i++)
            {
            
             if(this.bardatas[i].category_id==='Cat1'){
 
              
         this.datatableveg.push({'vendor_id':this.bardatas[i].vendor_id,'TOS':this.bardatas[i].serving_id,'Cat':this.bardatas[i].category_id,'item_name':this.bardatas[i].item_name})
        }//  for(){}
        else if(this.bardatas[i].category_id==='Cat2'){
          this.datatablenonveg.push({'vendor_id':this.bardatas[i].vendor_id,'TOS':this.bardatas[i].serving_id,'Cat':this.bardatas[i].category_id,'item_name':this.bardatas[i].item_name})
        }
            }


            (error : AppError) =>{
 
              this.handleException(error);}
      
             });
//dodoughnut Chart
this.dataserverService.getData(this.dougnutchart).subscribe(
  (dougdata)=>{
  this.datadough=dougdata

this.sortArray(this.datadough);


(error : AppError) =>{
 
  this.handleException(error);}
 });
         
     
}

sortArray(array: any[]){
  array.sort(function (a, b) {
    
     if(a.feedback < b.feedback){
                                              return 1;
                                            } else if(a.feedback == b.feedback){
                                              return 0;
                                            } else{
                                              return -1;
                                            }    
  });
}


 vendorForRecommendedItems(vendorID : string){
    for(var i=0; i<this.vendor_info.length; i++){
      if(this.vendor_info[i].vendor_id==vendorID){
        return this.vendor_info[i].vendor_name;
      }
    }

  }
   TimesofService(TOS : string){
    for(var i=0; i<this.Serving_info.length; i++){
      if(this.Serving_info[i].serving_id==TOS){
        return this.Serving_info[i].serving_name;
      }
    }

  }

 setVendor(vendor_value)
 {

   this.vendor_val=vendor_value;
 }

public random_rgba() {
    
    return [this.getRandomInt(10, 199), this.getRandomInt(10, 199), this.getRandomInt(10, 199)];
}



 public getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 public chartClicked(e:any):void {

  }
 
  public chartHovered(e:any):void {

  }
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


