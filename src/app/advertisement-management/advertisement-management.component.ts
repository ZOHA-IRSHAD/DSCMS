import { Component, OnInit,Input,ElementRef,ViewChild} from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule,AbstractControl} from '@angular/forms';
import { GlobalAdvariable } from '../GlobalAdvariable';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ServerService }from '../server.service';
import { SpinnerService } from "angular-spinners";
// import { ServerImageService }from '../serverimage.service';
// import { ServiceService } from "../services/service.service";

import { Http,Response } from '@angular/http';
import {NgxPaginationModule} from 'ngx-pagination';
import * as Adglobal from '../GlobalAdvariableInterface';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
// import { VendorRegistrationComponent } from '../vendor-registration/';
// import {Image} from '../image';
// import * as imageglob from '../imageinterface';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";


import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

import {UploadFileService} from '../upload-file.service';
// import * as globalValues from "../globalVar";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { type } from "os";
require('aws-sdk/dist/aws-sdk');


@Component({
  selector: 'app-advertisement-management',
  templateUrl: './advertisement-management.component.html',
  styleUrls: ['./advertisement-management.component.css'],
   providers: [ServerService]
})
export class AdvertisementManagementComponent implements OnInit {
  file: File;
  @ViewChild('fileInput')
myInputVariable: any;


  AdvertForm: FormGroup;
UrlforAdvert='http://'+globalValues.ipAddress+'/cafeteriamanagement/insertads';
UrlforUpdateAdvert='http://'+globalValues.ipAddress+'/cafeteriamanagement/updateads';
post='http://'+globalValues.ipAddress+'/cafeteriamanagement/addimageads'
Advertglob:GlobalAdvariable;

UrlImage='http://'+globalValues.ipAddress+'/cafeteriamanagement/addimageads'
loading: boolean = false;
  location_details : any[] =[];
  FOLDER = 'scms-images/';
arrAdvertLive : any[] = [];
sendAdvertid : any[] = [];
 
arrAdvertExpired : any[] = [];

public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose : true,
    preventDuplicates : true,
    showProgressBar:false,
    } 
    selectedFiles: FileList
  currentFileUpload: File
  progress: { percentage: number } = { percentage: 0 }

  constructor(private router:Router,
     private notifier : NotificationsService,
  private AdserverService:ServerService,
  private uploadService: UploadFileService,
  private spinnerService: SpinnerService 
) { }
Adstr1:any;
Adstr2:any;
Adstr3:any;
Adstr4:any;
Adnum:any;
Adstr5:any;
  today: string;

  ngOnInit() {

    var displayDate = new Date().toLocaleDateString();
    this.today = displayDate;



 this.AdvertForm=new FormGroup({

'ad_name':new FormControl(null,[Validators.required,Validators.pattern('^[a-zA-Z0-9\-\@\'\.\(\)\&\^\%\$\#\!\_ ]*$')]),
'contact_employee':new FormControl(null,[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]),
'email':new FormControl(null,[Validators.required,Validators.email]),
'phone':new FormControl(null,[Validators.required,Validators.pattern('[0-9]*')]),
'ad_start_date':new FormControl(null,Validators.required),
'ad_end_date':new FormControl(null,Validators.required),

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
 
  OnUpload(AdvertForm) {
    this.Advertglob=this.AdvertForm.value;
    this.Adstr1=this.Advertglob.ad_name;
this.Adstr2=this.Adstr1.substring(0,3);
this.Adstr3=this.Adstr2.toUpperCase();
this.Adstr4="00";
this.Adnum=Math.round(Math.random()*(100-1));
this.Adstr5=this.Adstr3+this.Adstr4+this.Adnum;
this.Advertglob._id=this.Adstr5;

// this.currentFileUpload = this.selectedFiles.item(0);
    //  console.log(this.Advertglob);

 
// console.log(AWSService);




// console.log(bucket);
 
    
    let formdata: FormData = new FormData();
    let  AWSService = (<any>window).AWS;
    // console.log(AWSService);
    AWSService.config.accessKeyId='AKIAIGVVDKLBCSNUP2RA';
    AWSService.config.secretAccessKey='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';
    AWSService.config.region='us-east-1';
    let bucket=new AWSService.S3({params: {Bucket: 'scms-images-bucket'}});
    const params = {
      Bucket: 'scms-images-bucket',
      Key: this.FOLDER + this.file.name,
      Body: this.file,
      ContentType: this.file.type,
      ACL: 'public-read'
    };

    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
      formdata.append('ad_image', this.currentFileUpload);
    formdata.append('formvalues',JSON.stringify(this.Advertglob));
    bucket.upload(params, function (err, data) {
      if (err) {
            this.notifier.error('There was an error uploading your file: ', err);
            return false;}
             this.notifier.success('Successfully uploaded file.');
          return true;
    });

   
 this.AdserverService.SaveData(this.post,formdata).subscribe(response=>{
  //  console.log(response);

      if(response.add==='successfull'){
this.notifier.success("Advertisment has been Registered Successfully");

   this.ResetForm();

      }
      else if(response.add==='Advert already exists'){
this.notifier.error("Oops!! Advertisment Already Exists!!");

     this.ResetForm();
      }
    else if(response.add==='failed to add Advert'){
this.notifier.error("Oops!! Advertisment was not Registered Successfully!! Please try it again");;

    this.ResetForm();
    }
     else if(response.add==='image already exists'){
this.notifier.error("Oops!! This Advertisment Image already Exists!! Please enter different image!!");;
// this.AdvertForm.reset();
    this.ResetForm();

     }
     (error : AppError) =>{
      this.handleException(error);}
    });

    this.selectedFiles = undefined;
       
   
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
ResetForm()
{
    this.AdvertForm.reset();
    this.myInputVariable.nativeElement.value = "";

}

 

}