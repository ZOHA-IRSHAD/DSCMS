import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from "../server.service";
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
import { NgxPaginationModule } from 'ngx-pagination';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import * as Locglobal from '../GlobalLocvariableInterface';
import { GlobalLocvariable } from '../Globallocvariable';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})

export class LocationComponent implements OnInit {
@ViewChild('fileInput')
myInputVariable:any;
file: File;

  urlForLocationDetails = "http://" + globalValues.ipAddress + "/cafeteriamanagement/locationdetailsadmin";
  urlToPostChanges = "http://" + globalValues.ipAddress + "/cafeteriamanagement/locationstatus";
  location_details: any[] = [];
  arrLocExpired: any[] = [];
  arrLocLive: any[] = [];

  metaData: any[] = [];
 FOLDER = 'scms-images/';
public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    }
  constructor(
    private serverService: ServerService,
      private notifier : NotificationsService,
      private LocserverService: ServerService,
      private router:Router,
private spinnerService: SpinnerService 	
  ) { }
    
 
  LocForm: FormGroup;
  Loc2: any;
  Loc1: any;
 selectedFiles: FileList
  currentFileUpload: File
  UrlforLoc = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/addnewlocation';
  Locationglob: GlobalLocvariable;
 


    ngOnInit() {
       this.LocForm = new FormGroup({
      'location_name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      'campus': new FormControl(null, [Validators.required]),

    });

// 
  }
      selectFile(event) {
     
    this.file = event.target.files.item(0)

    if (this.file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
   
      
    } 

    
          else{
             this.notifier.error('Invalid image format!');
          }
  }


   onSubmit() {
    this.Locationglob = this.LocForm.value;
    
  
 
     
    let formdata:FormData=new FormData();
     let  AWSService = (<any>window).AWS;

AWSService.config.accessKeyId='AKIAIGVVDKLBCSNUP2RA';
AWSService.config.secretAccessKey='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';
AWSService.config.region='us-east-1';
let bucket=new AWSService.S3({params: {Bucket: 'scms-images-bucket'}});
// console.log(bucket);
 const params = {
      Bucket: 'scms-images-bucket',
      Key: this.FOLDER + this.file.name,
      Body: this.file,
      ContentType: this.file.type,
      ACL: 'public-read'
    };
//     console.log(File);
//  console.log(params);

this.currentFileUpload=this.selectedFiles.item(0);

formdata.append('loc_image',this.currentFileUpload);
formdata.append('formvalues',JSON.stringify(this.Locationglob));
  bucket.upload(params, function (err, data) {
  if (err) {
        this.notifier.error('There was an error uploading your file: ');
        return false;}
         this.notifier.success('Successfully uploaded file.');
      return true;
 
});     // 
    
      
  this.LocserverService.SaveData(this.UrlforLoc,formdata).subscribe((response)=>{

if(response.operation==='successfull')
  {
    this.notifier.success('Location has been Created successfully');
 this.ResetForm();
    
  }
  else if(response.operation==='image already exists')
    {
      this.notifier.error('Location Image already exists!!');
        this.ResetForm();
    } 
    else if(response.operation==='location already exists')
      {
 this.notifier.error('This Location already exists');
  this.ResetForm();
      }
    else if(response.operation==='failed'){
      this.notifier.error('Failed to create a Location');
       this.ResetForm();
    }
    
	(error : AppError) =>{
	 
    this.handleException(error);}

  });
this.selectedFiles = undefined;



  }
  

  ResetForm() {
    this.LocForm.reset();
 
    this.myInputVariable.nativeElement.value = "";
    
  // this.image=undefined;
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