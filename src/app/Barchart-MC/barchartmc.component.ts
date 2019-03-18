import { Component, OnInit } from '@angular/core';
import { ServerService }from '../server.service';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";

@Component({
  selector: 'app-barchartmc',
  templateUrl: './barchartmc.component.html',
  styleUrls: ['./barchartmc.component.css']
})
export class BarchartmcComponent implements OnInit {

  datamcweek:any[]=[];
  datamcmonth:any[]=[];
  datamcyear:any[]=[];
  abcweek:any[]=[];
  abcmonth:any[]=[];
  abcyear:any[]=[];
  labelmcweek:any[];
  labelmcmonth:any[];
  labelmcyear:any[];
    public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
   scales: {
        yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max:5}}]
      },
       scaleShowValues: true,
scaleValuePaddingX: 10,
scaleValuePaddingY: 10,
// animation: {
//            onComplete: function () {
//                var chartInstance = this.chart,
//                ctx = chartInstance.ctx;
//                ctx.textAlign = 'center';
//                ctx.textBaseline = 'bottom';
//                this.data.datasets.forEach(function (dataset, i) {
//                    var meta = chartInstance.controller.getDatasetMeta(i);
//                    meta.data.forEach(function (bar, index) {
//                        var data = dataset.data[index];
//                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
//                    });
//                });
//            }
//        }

    
  };
  chartmcUrl='http://'+globalValues.ipAddress+'/cafeteriamanagement/getvendorfeedback';
  constructor(private chartmcserverService:ServerService,
    private router:Router,
    private spinnerService: SpinnerService){}
datax:any[]=[];
data1:any[]=[];
dataitc6:any[]=[];
dataitc5:any[]=[];
dataitc7:any[]=[];
data2week:any[]=[];
data2month:any[]=[];
data2year:any[]=[];
xyzweek:any[]=[];
xyzmonth:any[]=[];
xyzyear:any[]=[];
date:any;
firstday:any;
lastday:any;
loaded:boolean=false;
public barChartLabelsmcweek:string[];
public barChartLabelsmcmonth:string[];
public barChartLabelsmcyear:string[];
Vend_value:any;
setVendorValue(Vendor_value){
  this.Vend_value=Vendor_value;
}
  ngOnInit(){


     let displayDate = new Date().toLocaleDateString();
this.date=displayDate;
var curr = new Date; // get current date
var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
var last = first + 6; // last day is the first day + 6

this.firstday = new Date(curr.setDate(first)).toUTCString();
this.lastday = new Date(curr.setDate(last)).toUTCString();
     this.chartmcserverService.getData(this.chartmcUrl).subscribe(
      (dataset)=>{
        if(!dataset){
            
        }
else{
        
      this.datax=dataset;
      for(let i=0;i<this.datax.length;i++)
          {
            if(this.datax[i].location_id==='000-1')//main Cafetaria
          {            
            this.data1.push(this.datax[i]);
          }
         
        }
       
      for(let i=0;i<this.data1.length;i++)
          {  
           for(let j=0;j<this.data1[i].weeklyFeedbacks.length;j++)
            {
               this.data2week.push(this.data1[i].weeklyFeedbacks[j]);
            }
          for(let k=0;k<this.data1[i].monthlyFeedbacks.length;k++){

              this.data2month.push(this.data1[i].monthlyFeedbacks[k]);
          }
            for(let l=0;l<this.data1[i].yearlyFeedbacks.length;l++){

              this.data2year.push(this.data1[i].yearlyFeedbacks[l]);
          }

          }


      for(let i=0;i<this.data2week.length;i++)
          {
            
            this.xyzweek.push(this.data2week[i].week.split("-")[1]);
          }

     for(let i=0;i<this.data2month.length;i++)
          {
            // this.wk.push(this.data2[i]);
            this.xyzmonth.push(this.data2month[i].month.split("-")[1]);

           
          }

     for(let i=0;i<this.data2year.length;i++)
          {
            // this.wk.push(this.data2[i]);
            this.xyzyear.push(this.data2year[i].year.split("-")[1]);
           
          }
        this.labelmcweek=Array.from(new Set(this.xyzweek));
         this.labelmcmonth=Array.from(new Set(this.xyzmonth));
      
        this.barChartLabelsmcweek =this.labelmcweek;

         this.barChartLabelsmcmonth =this.labelmcmonth;
     
            this.barChartLabelsmcyear =this.labelmcyear;
  
        for(let i=0;i<this.data1.length;i++)
          {
               this.abcweek=[];
            for(let j = 0;j < this.data1[i].weeklyFeedbacks.length;j++)
              {
                this.abcweek.push(this.data1[i].weeklyFeedbacks[j].feedback);
              }
           this.datamcweek.push({"data":this.abcweek,"label":this.data1[i].vendor_name});
          }
          for(let i=0;i<this.data1.length;i++)
          {
               this.abcmonth=[];
            for(let j = 0;j < this.data1[i].monthlyFeedbacks.length;j++)
              {
                this.abcmonth.push(this.data1[i].monthlyFeedbacks[j].feedback);
              }
           this.datamcmonth.push({"data":this.abcmonth,"label":this.data1[i].vendor_name});
          }
           for(let i=0;i<this.data1.length;i++)
          {
               this.abcyear=[];
            for(let j = 0;j < this.data1[i].yearlyFeedbacks.length;j++)
              {
                this.abcyear.push(this.data1[i].yearlyFeedbacks[j].feedback);
              }
           this.datamcyear.push({"data":this.abcyear,"label":this.data1[i].vendor_name});
          }
          
             

     this.loaded=true;
       } 
       (error : AppError) =>{
 
        this.handleException(error);}
      });
   
      this.barChartDatamcweek=this.datamcweek;
      this.barChartDatamcmonth=this.datamcmonth;
      this.barChartDatamcyear=this.datamcyear;
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
  
  
  public barChartType:string = 'bar';
  public barChartLegendmc:boolean = true;
 
  public barChartDatamcweek:any[];
  public barChartDatamcmonth:any[];
  public barChartDatamcyear:any[];
  
 
  // events
  public chartClicked(e:any):void {

  }
   public chartHovered(e:any):void {

  }
 
 }