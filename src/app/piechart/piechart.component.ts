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
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent  implements OnInit {
chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  
  };
// chartLegend={
//   position:"bottom"
// };
Labels:any[]=['Veg', 'Non-Veg'];
  data:number[]=[];
   public doughnutChartData:number[] =[];
  //  addFeed:number;
  PieUrl='http://'+globalValues.ipAddress+'/cafeteriamanagement/getstatistics';
  constructor(private pieserverService:ServerService,
    private router:Router,
    private spinnerService: SpinnerService ){}
ngOnInit(){
  this.pieserverService.getData(this.PieUrl)
  .subscribe(
  (statdata)=>{

   
    this.doughnutChartLabels = this.Labels;
    // this.doughnutColors=['red','yellow'];
   
   
    this.doughnutChartData.push(statdata.daily_veg_feedback_count);
    this.doughnutChartData.push(statdata.daily_non_veg_feedback_count);



    (error : AppError) =>{
	 
      this.handleException(error);}

  }
  );
}
  // Doughnut
  public doughnutChartLabels:string[];  
  public chartColors:any[]= [{ backgroundColor:["#008000", "#D40000"]    }];
  public doughnutChartType:string = 'pie';
 
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