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
  selector: 'app-pie-chart-feedback-monthly',
  templateUrl: './pie-chart-feedback-monthly.component.html',
  styleUrls: ['./pie-chart-feedback-monthly.component.css']
})
export class PieChartFeedbackMonthlyComponent implements OnInit {
chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  
  };

option:any;
CatOption:any;
  data:number[]=[];
  
  public doughnutChartData_monthly:number[] =[];
  public doughnutChartData_yearly:number[] =[];
  PieUrl='http://'+globalValues.ipAddress+'/cafeteriamanagement/getstatistics';
  constructor(private piemonthlyserverService:ServerService,
    private router:Router,
    private spinnerService: SpinnerService ){}
ngOnInit(){
  this.piemonthlyserverService.getData(this.PieUrl)
  .subscribe(
  (statdata)=>{
  
   
    this.doughnutChartLabels = ['Veg', 'Non-Veg'];
   /****************Monthly***********/
 this.doughnutChartData_monthly.push(statdata.monthly_veg_feedback_count);
    this.doughnutChartData_monthly.push(statdata.monthly_non_veg_feedback_count);

   
   
   
	(error : AppError) =>{
	 
    this.handleException(error);}}
  );
}
 
  public doughnutChartLabels:string[];  
  public chartColors:any[]= [{ backgroundColor:["#008000", "#D40000"]    }];
  public doughnutChartType:string = 'pie';

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
		 }}

