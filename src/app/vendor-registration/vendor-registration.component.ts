import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { ServerService } from '../server.service';

import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { type } from "os";
require('aws-sdk/dist/aws-sdk');

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.css']

})

export class VendorRegistrationComponent implements OnInit {
  today: string;
    file: File;
     FOLDER = 'scms-images/';
      
  str1nospace: any;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 }
   post='http://'+globalValues.ipAddress+'/cafeteriamanagement/addimagevendor';
  UrlService='http://'+globalValues.ipAddress+'/cafeteriamanagement/timeofservicedetails';
  UrlCategory='http://'+globalValues.ipAddress+'/cafeteriamanagement/categorydetails'; 
UrlLocation='http://'+globalValues.ipAddress+'/cafeteriamanagement/locationdetails';
  @ViewChild('fileInput') 
  fileInput:any;
  loading: boolean = false;
  pwd: string;
  str1: any;
  str2: any;
  str3: any;
  str4: any;
  num: any;
  array: any ={};
  TOS:any[]=[];
  arrstr: string;
  
  RegistrationForm: FormGroup;
    Categories:any[]=[];
  Timeofservice:any[]=[];
  Location:any[]=[];
  Loc:any[]=[];
  Categ:any[]=[];

  constructor(
  private notifier : NotificationsService,
    private serverService: ServerService,
    private router:Router,
    private spinnerService: SpinnerService 	
     
  ) {


  }
 public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    } 
 
 

  ngOnInit() {
    var displayDate = new Date().toLocaleDateString();
    this.today = displayDate;


    this.RegistrationForm = new FormGroup({

      'vendor_name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9\-\' ]*$')]),
      'contact_person': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'email_address': new FormControl(null, [Validators.required, Validators.email]),
      'contact_number': new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]),
      'service_start_date': new FormControl(null, Validators.required),
      'service_end_date': new FormControl(null, [Validators.required]),
      'vendor_address': new FormControl(null, Validators.required),
      'food_cat': new FormControl(null, Validators.required),
      'time_of_service_id': new FormControl(null, Validators.required),
      'location_id': new FormControl(null, Validators.required),

    });
    //Time of Service
this.serverService.getData(this.UrlService)
.subscribe((timeofservice)=>{
 
  this.TOS=timeofservice;
 
   for(let i=0;i<this.TOS.length;i++)
  {
    this.Timeofservice.push({"Time_of_service_name":this.TOS[i].service_name,"TOS_id":this.TOS[i].service_id})
  }
  (error : AppError) =>{
	 
    this.handleException(error);}
      
      });
  //Location Names
       this.serverService.getData(this.UrlLocation)
.subscribe((BuildLoc)=>{
 
  this.Loc=BuildLoc;

   for(let i=0;i<this.Loc.length;i++)
  {
    this.Location.push({"Location_name":this.Loc[i].location_name,"Location_id":this.Loc[i].location_id})
  }
  (error : AppError) =>{
	 
    this.handleException(error);}
  
       });


       //Food Category
       this.serverService.getData(this.UrlCategory)
.subscribe((Cat)=>{
  
 
  this.Categ=Cat;

   for(let i=0;i<this.Categ.length;i++)
  {
    this.Categories.push({"Cat_id":this.Categ[i].cat_id,"Cat_name":this.Categ[i].cat_name})
  }
  (error : AppError) =>{
	 
    this.handleException(error);}
     });
  }
      selectFile(event) {
     
    this.file = event.target.files.item(0)

    if (this.file.type.match('image.*')) {
      this.selectedFiles = event.target.files;

    } else {
      this.notifier.error('Invalid image format!');
    }
  }

  onSubmit(RegistrationForm) {

    
    this.array = {
   
      "vendor_name": this.RegistrationForm.value.vendor_name,
      "contact_person": this.RegistrationForm.value.contact_person,
      "email_address": this.RegistrationForm.value.email_address,
      "contact_number": this.RegistrationForm.value.contact_number,
      "service_start_date": this.RegistrationForm.value.service_start_date,
      "service_end_date": this.RegistrationForm.value.service_end_date,
      "vendor_address": this.RegistrationForm.value.vendor_address,
      "location_id": this.RegistrationForm.value.location_id,
      "food_cat": this.RegistrationForm.value.food_cat,
      "time_of_service_id": this.RegistrationForm.value.time_of_service_id
    };
  
let formdata: FormData = new FormData();
let  AWSService = (<any>window).AWS;
// console.log(AWSService);
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
     this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
  formdata.append('vendor_image', this.currentFileUpload);
    formdata.append('formvalues',JSON.stringify(this.array));

    bucket.upload(params, function (err, data) {
  if (err) {
        this.notifier.error('There was an error uploading your file: ', err);
        return false;}
         this.notifier.success('Successfully uploaded file.');
      return true;
});
    this.serverService.SaveData(this.post,formdata).subscribe(response=>{
   console.log(response);
      if(response.add==='successfull'){
this.notifier.success("Vendor has been Registered Successfully")
// this.router.navigate(['/left-nav-bar/docupload']);
this.ResetForm();
      }
      else if(response.add==='Vendor already exists'){
this.notifier.error("Oops!! Vendor Already Exists!!")
this.ResetForm();
      }
    else if(response.add==='failure in adding the vendor'){
this.notifier.error("Oops!! Vendor was not Registered Successfully!! Please try it again");
this.ResetForm();
    }
     else if(response.add==='image already exists'){
this.notifier.error("Oops!! This Vendor Image already Exists!! Please enter different image!!");
this.ResetForm();

     }
     (error : AppError) =>{
	 
      this.handleException(error);}
    });
 
    this.selectedFiles = undefined


 

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
   


  ResetForm() {
 this.RegistrationForm.reset();

    this.fileInput.nativeElement.value = "";

  }

}

