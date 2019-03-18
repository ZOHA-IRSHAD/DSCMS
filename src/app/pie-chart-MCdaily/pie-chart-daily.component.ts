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
  selector: 'app-pie-chart-daily',
  templateUrl: './pie-chart-daily.component.html',
  styleUrls: ['./pie-chart-daily.component.css']
})
export class PieChartDailyComponent implements OnInit {
dougnutmcURL='http://'+globalValues.ipAddress+'/cafeteriamanagement/getvendorfeedback';
data:any[]=[];
 public chartColors:any[]=[];
public doughnutChartLabels:string[]=[];
  public doughnutChartData:number[]=[];
  public doughnutChartType:string = 'doughnut';
  public dataall:string[]=[];
  constructor(private DougnutmcserverService:ServerService,
    private router:Router,
    private spinnerService: SpinnerService ) { }

  ngOnInit() {
    this.DougnutmcserverService.getData(this.dougnutmcURL).subscribe(
      (doudata)=>{
      this.data=doudata;
      for(let i=0;i<this.data.length;i++){
        if(this.data[i].location_id==="000-1")
          {
            this.doughnutChartData.push(this.data[i].daily_avg_feedback);
            this.dataall.push(this.data[i].vendor_name);

// this.chartColors= [{ backgroundColor:["#008000", "#D40000"]    }];
          }
      }
        this.doughnutChartLabels=this.dataall;
        
	(error : AppError) =>{
	 
    this.handleException(error);}

      }
          );
   
    
    // this.doughnutChartData=this.doughnutChartData;
  //  this.doughnutChartLabels= this.doughnutChartLabels;
     

// this.chartColors= [{ backgroundColor:["#008000", "#D40000"]    }];
  }
// this.chartColors= [{ backgroundColor:["#008000", "#D40000"]    }];
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
