import { Component, OnInit, NgZone, HostListener, Inject } from '@angular/core';
import { ServiceService } from "../services/service.service";
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import * as globalValues from "../Global-var-fun/globalVarFun";
import { SpinnerService } from 'angular-spinners';
// import { ToasterModule, ToasterService, ToasterConfig, Toast } from 'angular2-toaster';
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchByPipe } from "../filters/SearchBy.pipe";
import { OrderByPricePipe } from "../filters/OrderByPrice.pipe";
import { NavbarComponent } from "../navbar/navbar.component";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { CartComponent } from "../cart/cart.component";
import { NotificationsService } from "angular2-notifications";

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-time-service',
  templateUrl: './time-service.component.html',
  styleUrls: ['./time-service.component.css'],
})
export class TimeServiceComponent implements OnInit {
  Status: any;
  //URLs
  urlForTOS = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/timeofservicedetails';
  urlForCategory = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/categorydetails';
  //Arrays
  menus: any[] = [];
  service_details: any[];
  categoryDetails: any[];
  vendorDetails: any[];
  recommendedItems: any[] = [];
  tempRecommendedItemsArray: any[] = [];
  //Variables
  idOfCategory: string;
  idOfService: string;
  idOfVendor: string;
  nameOfVendor: string;
  nameOfCategory: string;
  data: any;
  nameOfBuilding: any;
  idOfBuilding: any;
  time: any;
  isDesc: boolean = false;
  column: string;
  direction: number;
  showRecommendedItems: boolean = true;
  TOSRecommended: string;
  vendorInCart: string;
  recommendedEmpty: boolean = false;
  menuarrayEmpty: boolean = false;
  resetEnable: boolean = false;
  isTop: boolean = true;

  constructor(private ServiceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    this.spinnerService.show('mySpinner');
    if (JSON.parse(localStorage.getItem("cartItems"))) {
      globalValues.setItemArray(JSON.parse(localStorage.getItem("cartItems")));
      globalValues.setStockArray(JSON.parse(localStorage.getItem("StockAvailable")));
      if (JSON.parse(localStorage.getItem("Quantity")))
        globalValues.setQuantityArray(JSON.parse(localStorage.getItem("Quantity")));
      else
        globalValues.setQuantityArray([]);
    }
    else {
      globalValues.setItemArray([]);
      globalValues.setStockArray([]);
    }

    // query params                                                 
    this.data = this.route
      .queryParams
      .subscribe(params => {
        this.nameOfBuilding = params['nameOfBuilding']
        this.idOfBuilding = params['idOfBuilding']
      });

    if (!this.nameOfBuilding) {
      this.nameOfBuilding = localStorage.getItem("location_name");
      this.idOfBuilding = localStorage.getItem("location_id");
    }
    //service for TOS details
    // this.spinnerService.show('mySpinner');  
    this.ServiceService.getDataFromServer(this.urlForTOS)
      .subscribe(service_details => {
        this.service_details = service_details;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 150);
        // this.spinnerService.hide('mySpinner');

      },
      (error: AppError) => {
        this.handleException(error);
      });
    //service for category details
    // this.spinnerService.show('mySpinner');
    this.ServiceService.getDataFromServer(this.urlForCategory)
      .subscribe(categoryDetails => {
        this.categoryDetails = categoryDetails;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 150);
        // this.spinnerService.hide('mySpinner');
      },
      (error: AppError) => {
        this.handleException(error);
      });
    this.getRecommendedItems();

    //service for vendor details
    let urlForVendors = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/' + this.idOfBuilding + '/vendordetails';
    // this.spinnerService.show('mySpinner');
    this.ServiceService.getDataFromServer(urlForVendors)
      .subscribe(vendorDetails => {
        this.vendorDetails = vendorDetails;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 150);
        // this.spinnerService.hide('mySpinner');
      },
      (error: AppError) => {
        this.handleException(error);
      });
  }
    
  //function to handle exceptions
  handleException(error: AppError) {
    this.spinnerService.hide('mySpinner');
    if (error instanceof ConnectionTimeOut) {
      globalValues.setErrorCode(0);
      this.router.navigate(['/exception']);
    }
    else if (error instanceof BadInput) {
      globalValues.setErrorCode(400);
      this.router.navigate(['/exception']);
    }

    else if (error instanceof NotFoundError) {
      globalValues.setErrorCode(404);
      this.router.navigate(['/exception']);
    }

    else if (error instanceof InternalServerError) {
      globalValues.setErrorCode(500);
      this.router.navigate(['/exception']);
    }
    else {
      globalValues.setErrorCode(-1);
      throw error;
    }
  }


  //function to get the vendor name
  vendorOfItem(vendorID: string) {
    for (var i = 0; i < this.vendorDetails.length; i++) {
      if (this.vendorDetails[i].vendor_id == vendorID) {
        return this.vendorDetails[i].vendor_name;
      }
    }

  }

  //function to clear the existing cart and add new item
  clearCartAndAdd(menu) {
    globalValues.setValue(0);
    globalValues.Items.splice(0);
    globalValues.quantity.splice(0);
    globalValues.stock.splice(0);
    localStorage.removeItem('StockAvailable');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('Quantity');
    this.addToCart(menu);
  }

  removeItem(item) {
    console.log("calling remove");
    let j: any;
    for (j in globalValues.Items) {

      if (globalValues.Items[j].foodItems == item.item_name) {
        console.log("inside if");
        globalValues.Items.splice(j, 1);
        globalValues.quantity.splice(j, 1);
        globalValues.stock.splice(j, 1);
        globalValues.setValue(globalValues.countItems - 1);
        var toastOptions: ToastOptions = {
          title: "",
          msg: item.item_name + ' is removed from the Cart',
          showClose: false,
          timeout: 2000,
          theme: 'error',
          onAdd: (toast: ToastData) => {
          },
          onRemove: function (toast: ToastData) {
          }

        };
        this.toastyService.error(toastOptions);
      }

    }
    localStorage.setItem("cartItems", JSON.stringify(globalValues.Items));
    localStorage.setItem("StockAvailable", JSON.stringify(globalValues.stock));
    localStorage.setItem("Quantity", JSON.stringify(globalValues.quantity));
    globalValues.updateCartNumber();
  }

  //function for getting vendor details
  getVendor(vendor: string) {
    var vendorString = vendor.split(",");
    this.idOfVendor = vendorString[0];
    this.nameOfVendor = vendorString[1];
    this.checkAllDropdowns();
    this.filterRecommendedItems();

  }
  //function for getting category details
  getCategory(category: string) {
    var catString = category.split(",");
    this.idOfCategory = catString[0];
    this.nameOfCategory = catString[1];
    this.checkAllDropdowns();
    this.filterRecommendedItems();

  }
  //function for getting TOS details
  getTOS(TOS: string) {
    this.idOfService = TOS;
    this.checkAllDropdowns();
    this.filterRecommendedItems();


  }
  //function for checking dropdowns
  checkAllDropdowns() {
    if (this.idOfVendor && this.idOfCategory && this.idOfService) {
      this.showRecommendedItems = false;
      this.recommendedEmpty = false;
      this.getFoodItems();

    }
  }

  //function to link vendor for recommended items
  linkVendor(vendor_id: string) {
    for (var i = 0; i < this.vendorDetails.length; i++) {
      if (this.vendorDetails[i].vendor_id == vendor_id) {
        return this.vendorDetails[i].vendor_name;
      }
    }
  }

  //function to link category for recommended items
  linkCategory(category_id: string) {
    for (var i = 0; i < this.categoryDetails.length; i++) {
      if (this.categoryDetails[i].cat_id == category_id) {
        return this.categoryDetails[i].cat_name;
      }
    }
  }

  //function for getting recommended items
  getRecommendedItems() {
    //service for recommended items
    let urlForRecommendedItems = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/' + this.checkTOS() + '/' + this.idOfBuilding + '/topitems ';
    this.spinnerService.show('mySpinner');
    this.ServiceService.getDataFromServer(urlForRecommendedItems)
      .subscribe(recommendedItems => {
        this.recommendedItems = recommendedItems;
        if (this.recommendedItems.length == 0) {
          this.recommendedEmpty = true;
        }
        else {
          this.recommendedEmpty = false;
        }
        this.tempRecommendedItemsArray = this.recommendedItems;
        this.spinnerService.hide('mySpinner');
      },
      (error: AppError) => {
        this.handleException(error);
      });
  }

  //function for getting menu items
  getFoodItems() {
    let urlForMenuItems = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/' + this.idOfVendor + '/' + this.idOfService + '/' + this.idOfCategory + '/menudetails';
    //service for menus details
    this.spinnerService.show('mySpinner');
    this.ServiceService.getDataFromServer(urlForMenuItems)
      .subscribe(menus => {
        this.menus = menus;
        if (this.menus.length == 0) {
          this.menuarrayEmpty = true;
          this.recommendedEmpty = false;
        }
        else {
          this.menuarrayEmpty = false;
          this.recommendedEmpty = false;
        }
        this.spinnerService.hide('mySpinner');
      },
      (error: AppError) => {
        this.handleException(error);
      });
    for (let i = 0; i <= globalValues.Items.length; i++) {
      globalValues.quantity.push(1);
    }
  }


  //function for filtering recommended items
  filterRecommendedItems() {
    if (this.idOfCategory && this.idOfVendor) {
      this.tempRecommendedItemsArray = [];
      for (var i = 0; i < this.recommendedItems.length; i++) {
        if (this.recommendedItems[i].category_id == this.idOfCategory && this.recommendedItems[i].vendor_id == this.idOfVendor) {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
        else if (this.idOfCategory == 'both' && this.recommendedItems[i].vendor_id == this.idOfVendor) {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
      }
    }

    if (this.idOfCategory && this.idOfService) {
      this.tempRecommendedItemsArray = [];
      for (var i = 0; i < this.recommendedItems.length; i++) {
        if (this.recommendedItems[i].category_id == this.idOfCategory && this.recommendedItems[i].serving_id == this.idOfService) {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
        else if (this.idOfCategory == 'both' && this.recommendedItems[i].serving_id == this.idOfService) {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
      }
    }

    if (this.idOfService && this.idOfVendor) {
      this.tempRecommendedItemsArray = [];
      for (var i = 0; i < this.recommendedItems.length; i++) {
        if (this.recommendedItems[i].serving_id == this.idOfService && this.recommendedItems[i].vendor_id == this.idOfVendor) {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
      }
    }

    if (this.idOfVendor && !this.idOfCategory && !this.idOfService) {
      this.tempRecommendedItemsArray = [];
      for (var i = 0; i < this.recommendedItems.length; i++) {
        if (this.recommendedItems[i].vendor_id == this.idOfVendor) {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
      }
    }

    if (this.idOfCategory && !this.idOfVendor && !this.idOfService) {
      this.tempRecommendedItemsArray = [];
      for (var i = 0; i < this.recommendedItems.length; i++) {
        if (this.recommendedItems[i].category_id == this.idOfCategory || this.idOfCategory == 'both') {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
      }
    }

    if (this.idOfService && !this.idOfCategory && !this.idOfVendor) {
      this.tempRecommendedItemsArray = [];
      for (var i = 0; i < this.recommendedItems.length; i++) {
        if (this.recommendedItems[i].serving_id == this.idOfService) {
          this.tempRecommendedItemsArray.push(this.recommendedItems[i]);
        }
      }
    }

    if (this.tempRecommendedItemsArray.length == 0) {
      this.recommendedEmpty = true;
      this.menuarrayEmpty = false;
    }
    else {
      this.recommendedEmpty = false;
    }
  }

  //function to reset the filters
  resetFilter(flag: number) {
    if (flag == 0) {
      this.idOfCategory = null;
      this.idOfService = null;
      this.idOfVendor = null;
      if (!this.idOfVendor && !this.idOfCategory && !this.idOfService) {
        this.showRecommendedItems = true;
        this.menuarrayEmpty = false;
        this.getRecommendedItems();
      }
      $("#reset").val('default').selectpicker('refresh');
      $("#service").val('default').selectpicker('refresh');
      $("#vendor").val('default').selectpicker('refresh');
      $("#category").val('default').selectpicker('refresh');

    }

    if (flag == 1) {
      this.idOfService = null;
      if (!this.idOfVendor && !this.idOfCategory && !this.idOfService) {
        this.showRecommendedItems = true;
        this.menuarrayEmpty = false;
        this.getRecommendedItems();
      }
      if ((this.idOfVendor && this.idOfCategory && !this.idOfService) ||
        (this.idOfVendor && !this.idOfCategory && !this.idOfService) ||
        (!this.idOfVendor && this.idOfCategory && !this.idOfService) ||
        (!this.idOfService && this.idOfCategory && this.idOfVendor)) {
        this.showRecommendedItems = true;
        this.menuarrayEmpty = false;
        this.filterRecommendedItems();
      }
      $("#reset").val('default').selectpicker('refresh');
      $("#service").val('default').selectpicker('refresh');


    }
    if (flag == 2) {
      this.idOfVendor = null;
      if (!this.idOfVendor && !this.idOfCategory && !this.idOfService) {
        this.showRecommendedItems = true;
        this.menuarrayEmpty = false;
        this.getRecommendedItems();
      }
      if ((!this.idOfVendor && this.idOfCategory && this.idOfService) ||
        (!this.idOfVendor && !this.idOfCategory && this.idOfService) ||
        (!this.idOfVendor && this.idOfCategory && !this.idOfService) ||
        (!this.idOfVendor && this.idOfCategory && this.idOfService)) {
        this.showRecommendedItems = true;
        this.menuarrayEmpty = false;
        this.filterRecommendedItems();
      }
      $("#reset").val('default').selectpicker('refresh');
      $("#vendor").val('default').selectpicker('refresh');

    }
    if (flag == 3) {
      this.idOfCategory = null;
      if (!this.idOfVendor && !this.idOfCategory && !this.idOfService) {
        this.showRecommendedItems = true;
        this.menuarrayEmpty = false;
        this.getRecommendedItems();
      }
      if ((this.idOfVendor && !this.idOfCategory && this.idOfService) ||
        (!this.idOfVendor && !this.idOfCategory && this.idOfService) ||
        (this.idOfVendor && !this.idOfCategory && !this.idOfService) ||
        (!this.idOfCategory && this.idOfCategory && this.idOfService)) {
        this.showRecommendedItems = true;
        this.menuarrayEmpty = false;
        this.filterRecommendedItems();
      }
      $("#reset").val('default').selectpicker('refresh');
      $("#category").val('default').selectpicker('refresh');
    }
  }

  //function to get vendor name of the item present in cart
  VendorInCart() {
    if (globalValues.Items.length > 0) {
      this.vendorInCart = globalValues.Items[0].vendorName;
      return globalValues.Items[0].vendorName;
    }
  }

  //function to check whether item can be added to cart or not
  checkForAddingToCart(menu) {
    if (globalValues.Items.length == 0) {
      return true;
    }
    else {
      for (let j = 0; j < globalValues.Items.length; j++) {
        if (menu.vendor_id != globalValues.Items[j].vendorId) {
          return false;
        }

      }
    }
    return true;
  }

  //function to add food items to cart
  addToCart(menu) {
    if (this.checkForAddingToCart(menu) == true) {
      if (!this.nameOfVendor || !this.nameOfCategory || !this.idOfService) {
        //for recommended items
        globalValues.Items.push
          ({
            "vendorId": menu.vendor_id,
            "vendorName": this.linkVendor(menu.vendor_id),
            "item_id": menu.item_id,
            "foodItems": menu.item_name,
            "categoryId": menu.category_id,
            "categoryName": this.linkCategory(menu.category_id),
            "ratePerPlate": menu.amount_per_plate,
            "serving_id": menu.serving_id[0]
          });
      }
      else {
        //for today's menu
        globalValues.Items.push
          ({
            "vendorId": menu.vendor_id,
            "vendorName": this.nameOfVendor,
            "item_id": menu.item_id,
            "foodItems": menu.item_name,
            "categoryId": this.idOfCategory,
            "categoryName": this.nameOfCategory,
            "ratePerPlate": menu.amount_per_plate,
            "serving_id": menu.serving_id[0]
          });
      }
      globalValues.stock.push(menu.quantity);
      globalValues.setValue(globalValues.countItems + 1);


      var toastOptions: ToastOptions = {
        title: "",
        msg: menu.item_name + ' is Added to the Cart',
        showClose: false,
        timeout: 2000,
        theme: 'success',
        onAdd: (toast: ToastData) => {
        },
        onRemove: function (toast: ToastData) {

        }

      };
      this.toastyService.success(toastOptions);
      localStorage.setItem("cartItems", JSON.stringify(globalValues.Items));
      localStorage.setItem("StockAvailable", JSON.stringify(globalValues.stock));
      globalValues.updateCartNumber();
      this.VendorInCart();
    }
  }


  //function for check that items is available in cart
  isItemAdded(menu) {
    if (JSON.parse(localStorage.getItem("cartItems"))) {
      globalValues.setItemArray(JSON.parse(localStorage.getItem("cartItems")));
    }
    if (globalValues.Items.length == 0) {
      return false;
    }
    else {
      for (let j = 0; j < globalValues.Items.length; j++) {
        if (menu.item_name == globalValues.Items[j].foodItems) {
          if (menu.vendor_id == globalValues.Items[j].vendorId) {
            if (menu.serving_id == globalValues.Items[j].serving_id) {
              return true;
            }
          }
        }
      }
    }
  }

  //function for sort the food items according to price
  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  //function for making TOS enable or disable
  enableTOS(TOS: string) {
    var dateObj = new Date();
    var hour, min;
    var actualTOS, actualName;
    hour = dateObj.getHours();
    min = dateObj.getMinutes();

    if (TOS == "TOS3") {
      actualTOS = "TOS3";
      return true;
    }
    if (hour >= 8 && hour <= 11) {
      if (hour <= 10) {
        actualTOS = "TOS1";
      }
      else if (hour == 11) {
        if (min <= 0)
          actualTOS = "TOS1";
      }
    }
    else if (hour >= 12 && hour <= 14) {
      if (hour <= 13) {
        actualTOS = "TOS2";
      }
      else if (hour == 14) {
        if (min <= 30)
          actualTOS = "TOS2";
      }
    }
    else if (hour >= 20 && hour <= 22) {
      if (hour <= 21) {
        actualTOS = "TOS4";
      }
      else if (hour == 22) {
        if (min <= 0)
          actualTOS = "TOS4";
      }
    }
    if (actualTOS == TOS)
      return true;
    else
      return false;
  }

  //function to scroll back to top
  onTop() {
 window.scrollTo({ left: 0, top: 0, behavior: 'smooth' }); 
 }


  //Function to get the TOS for Recommended Items
  checkTOS() {
    var dateObj = new Date();
    var hour, min;
    hour = dateObj.getHours();
    min = dateObj.getMinutes();

    if (hour >= 8 && hour <= 11) {
      if (hour <= 10) {
        return "TOS1";
      }
      else if (hour == 11) {
        if (min <= 0)
          return "TOS1";
      }
    }
    else if (hour >= 12 && hour <= 14) {
      if (hour <= 13) {
        return "TOS2";
      }
      else if (hour == 14) {
        if (min <= 30)
          return "TOS2";
      }
    }
    else if (hour >= 20 && hour <= 22) {
      if (hour <= 21) {
        return "TOS4";
      }
      else if (hour == 22) {
        if (min <= 0)
          return "TOS4";
      }
    }
    else return "TOS3";

  }
}
