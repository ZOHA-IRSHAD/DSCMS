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
  selector: 'app-pie-chart-feedback-weekly',
  templateUrl: './pie-chart-feedback-weekly.component.html',
  styleUrls: ['./pie-chart-feedback-weekly.component.css']
})
export class PieChartFeedbackWeeklyComponent implements OnInit {
chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  
  };
  

//   option:any;
CatOption:any;
  data:number[]=[];
  //  public doughnutChartData_daily:number[] =[];
   public doughnutChartData_weekly:number[]=[];
  // public doughnutChartData_monthly:number[] =[];
  // public doughnutChartData_yearly:number[] =[];
  PieUrl='http://'+globalValues.ipAddress+'/cafeteriamanagement/getstatistics';
  constructor(private pieweeklyserverService:ServerService,
    private router:Router,
    private spinnerService: SpinnerService ){}
ngOnInit(){
  this.pieweeklyserverService.getData(this.PieUrl)
  .subscribe(
  (statdata)=>{
  
    this.doughnutChartLabels = ['Veg', 'Non-Veg'];
    
  /****************Weekly***********/

 this.doughnutChartData_weekly.push(statdata.weekly_veg_feedback_count);
    this.doughnutChartData_weekly.push(statdata.weekly_non_veg_feedback_count);
 

//  /****************Monthly***********/
//  this.doughnutChartData_monthly.push(statdata.monthly_veg_feedback_count);
//     this.doughnutChartData_monthly.push(statdata.monthly_non_veg_feedback_count);

//    
//  /****************Yearly***********/
//  this.doughnutChartData_yearly.push(statdata.yearly_veg_feedback_count);
//     this.doughnutChartData_yearly.push(statdata.yearly_non_veg_feedback_count);

//    

  
  
	(error : AppError) =>{
	 
    this.handleException(error);}}
  );
}
  // Doughnut
  public doughnutChartLabels:string[];  
  public chartColors:any[]= [{ backgroundColor:["#008000", "#D40000"]    }];
  public doughnutChartType:string = 'pie';
//  onChange(event){
 
//     	this.option = event;
// 			if(this.option == "Daily"){
// 				this.CatOption = 'Daily';
// 			}
// 		 if(this.option == "Weekly"){
// 				this.CatOption = "Weekly";
// 			}
// 			else if(this.option == "Monthly"){
// 				this.CatOption = "Monthly";
//       }
//       else if(this.option == "Yearly"){
// 				this.CatOption = "Yearly";
// 			}
		
//  }
  // events
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

