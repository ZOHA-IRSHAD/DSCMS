import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIdleModule } from '@ng-idle/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {ToastyModule} from 'ng2-toasty';
import { AbstractControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpResponse, HttpEventType, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { AppComponent } from './app.component';
import { Http } from '@angular/http';
import { HomePageComponent } from './home-page/home-page.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import chart from 'chart.js';
import { RatingModule } from "ngx-rating";
import { SpinnerModule } from 'angular-spinners';



import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { LocationComponent } from './location/location.component';
import { AdvertisementManagementComponent } from './advertisement-management/advertisement-management.component';
import { Daterangepicker } from 'ng2-daterangepicker';


import { PieChartFeedbackWeeklyComponent } from './pie-chart-feedback-weekly/pie-chart-feedback-weekly.component';
import { PieChartFeedbackMonthlyComponent } from './pie-chart-feedback-monthly/pie-chart-feedback-monthly.component';
import { PieChartFeedbackYearlyComponent } from './pie-chart-feedback-yearly/pie-chart-feedback-yearly.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';

import { WalletComponent } from './wallet/wallet.component';
import { HomeComponent } from './home/home.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TimeServiceComponent } from './time-service/time-service.component';
import { OrderReceiptComponent } from './order-receipt/order-receipt.component';
import { ServiceService } from "./services/service.service";
import { HttpModule } from "@angular/http";
import { LoginComponent } from './login/login.component';
import { LoginService } from "./services/login.service";
import { NavbarComponent } from './navbar/navbar.component';
import { CartComponent } from './cart/cart.component';
import { ExtraComponent } from './extra/extra.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { EqualValidator } from './password-change/equal-validator.directive';
import { ServerService } from './server.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LeftNavBarComponent } from './left-nav-bar/left-nav-bar.component';

import { UserRegistrationComponent } from './user-registration/user-registration.component';

import { AdvertExpPipe } from './pipes/searchAdv.pipe';
import { SearchExpLocPipe } from './pipes/searchExpLoc.pipe';
import { SearchExpVendorsPipe } from './pipes/searchExpVendors.pipe';
import { searchLiveAds } from './pipes/searchLiveAds.pipe';
import { searchLiveLocpipes } from './pipes/searchLiveLoc.pipe';
import { searchLiveVendpipes } from './pipes/searchliveVend.pipe';
import { searchLiveUserpipes } from './pipes/searchUserIdlive.pipe';
import { searchExpUserpipes } from './pipes/searchUserIdExp.pipe';
import { SearchByPipe } from "./filters/SearchBy.pipe";
import { OrderByPricePipe } from "./filters/OrderByPrice.pipe";
import { UploadFileService } from './upload-file.service';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { AppErrorHandler } from "./exception-handler/app-error-handler";
import { ExceptionComponent } from "./exception/exception.component";
import { AddUserComponent } from './add-user/add-user.component';
import { LiveAddComponent } from './live-add/live-add.component';
import { ExpiredAddComponent } from './expired-add/expired-add.component';
import { ExpiredVendorComponent } from './expired-vendor/expired-vendor.component';
import { LiveVendorComponent } from './live-vendor/live-vendor.component';
import { LiveLocationComponent } from './live-location/live-location.component';
import { ExpiredLocationComponent } from './expired-location/expired-location.component';
import { ExpiredUserComponent } from './expired-user/expired-user.component';
import { LiveUserComponent } from './live-user/live-user.component';
import { Extra1Component } from './extra1/extra1.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    WalletComponent,
    HomeComponent,
    TransactionHistoryComponent,
    OrderReceiptComponent,
    //PaymentComponent,
    TimeServiceComponent,
    LoginComponent,
    NavbarComponent,
    CartComponent,
    ExtraComponent,
    PasswordChangeComponent,
    EqualValidator,
    HomePageComponent,

    VendorRegistrationComponent,
  
    LocationComponent,
    AdvertisementManagementComponent,
    ForgotPasswordComponent ,
    // ResetVendorPwdComponent,



    PieChartFeedbackWeeklyComponent,
    PieChartFeedbackMonthlyComponent,
    PieChartFeedbackYearlyComponent,
    DashboardComponent,
    LeftNavBarComponent,
    UserRegistrationComponent,

    //pipes
    AdvertExpPipe,
    SearchByPipe,
    OrderByPricePipe,
    SearchExpLocPipe,
    SearchExpVendorsPipe,
    searchLiveAds,
    searchLiveLocpipes,
    searchLiveVendpipes,
    searchLiveUserpipes,
    searchExpUserpipes,
    // DocuploadComponent,
   
     ExceptionComponent,
    AddUserComponent,
    LiveAddComponent,
    ExpiredAddComponent,
    ExpiredVendorComponent,
    LiveVendorComponent,
    LiveLocationComponent,
    ExpiredLocationComponent,
    ExpiredUserComponent,
    LiveUserComponent,
    Extra1Component,
    HelpComponent,
    // Extra1Component,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    NgxPaginationModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    Daterangepicker,
    RatingModule,
    SpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgIdleModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'navBar',
        component: NavbarComponent,
        children: [
          {
            path: 'home',
            component: HomeComponent

          },
          {
            path: 'timeService',
            component: TimeServiceComponent
          },
          {
            path: 'cart',
            component: CartComponent
          },
          {
            path: 'help',
            component: HelpComponent
          },
          {
            path: 'extra',
            component: ExtraComponent
          },
           {
            path: 'extra1',
            component: Extra1Component
          },
          {
            path: 'orderReceipt',
            component: OrderReceiptComponent
          },
          {
            path: 'wallet',
            component: WalletComponent
          },
          {
            path: 'transactionHistory',
            component: TransactionHistoryComponent
          },

        ]
      },
      {
        path: 'exception',
        component: ExceptionComponent
      },
      {
        path: 'passwordchange',
        component: PasswordChangeComponent
      },
      {
        path: 'userRegistration',
        component: UserRegistrationComponent
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent
      },
      // admin  
      {
        path: 'Dashboard',
        component: DashboardComponent
      },
      {
        path: 'left-nav-bar',
        component: LeftNavBarComponent,
        children: [
          {
            path: 'home-page',
            component: HomePageComponent

          },
          {
            path: 'vendor-registration',
            component: VendorRegistrationComponent
          },


          {
            path: 'Dashboard',
            component: DashboardComponent
          },


          {
            path: 'live-vendor',
            component: LiveVendorComponent
          },
           {
            path: 'expired-vendor',
            component: ExpiredVendorComponent
          },

          {
            path: 'location',
            component: LocationComponent
          },
           {
            path: 'live-location',
            component: LiveLocationComponent
          },
          {
            path: 'expired-location',
            component: ExpiredLocationComponent
          },
          {
            path: 'add-user',
            component: AddUserComponent
          },
          {
            path: 'live-user',
            component: LiveUserComponent
          },
          {
            path: 'expired-user',
            component: ExpiredUserComponent
          },

          {
            path: 'advertisement-management',
            component: AdvertisementManagementComponent
          },
          {
            path: 'live-add',
            component: LiveAddComponent
          },
          {
            path: 'expired-add',
            component: ExpiredAddComponent
          },
          // {
          //   path: 'docupload',
          //   component: DocuploadComponent
          // }
         
          
        ],

      }
    ], { useHash: true })


  ],
  providers: [
    ServiceService,
    LoginService,
    ServerService,
    UploadFileService,
    { provide: ErrorHandler, useClass: AppErrorHandler }

  ],
  bootstrap: [
    AppComponent

  ]
})
export class AppModule { }
