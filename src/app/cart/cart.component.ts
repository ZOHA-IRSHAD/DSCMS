import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from "../services/service.service";
import * as globalValues from "../Global-var-fun/globalVarFun";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
// import { ToasterModule, ToasterService, ToasterConfig, Toast } from 'angular2-toaster';
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { NotificationsService } from 'angular2-notifications';
import { NavbarComponent } from "../navbar/navbar.component";
import { AppError } from "../exception-handler/app-error";
import { NotFoundError } from "../exception-handler/not-found-error";
import { BadInput } from "../exception-handler/bad-input";
import { InternalServerError } from "../exception-handler/internal-server-error";
import { ConnectionTimeOut } from "../exception-handler/connection-timeout-error";
import { SpinnerService } from "angular-spinners";
// import { Razorpay } from "../Global-var-fun/globalVarFun";
declare var Razorpay;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  username: string;

  collectionTime: any;
  orderStatus: string = "active";
  payment_id: any;
  // paymentMode : string ;
  Money: number;
  //URLs
  urlUserInfo = "http://" + globalValues.ipAddress + "/cafeteriamanagement/getuserdetails?user_id=" + localStorage.getItem('currentUser');
  urlForPayment = 'http://' + globalValues.ipAddress + '/cafeteriamanagement/makeorder';
  urlForFetchingQuantity = "http://" + globalValues.ipAddress + "/cafeteriamanagement/cartitems";

  //Variables
  data: any;
  orderData;
  orderid;
  nameOfService: string;
  nameOfBuilding: string;
  nameOfVendor: string;
  nameOfCategory: string;
  idOfBuilding: any;
  idOfVendor: any;
  idOfService: any;
  idOfCategory: any;
  showCart: boolean = false;
  sum: number;
  today: any;
  userdetails: any;
  //Arrays
  responseQuantity: any[];
  menus: any[];
  menuItem: any[];
  quantityAddSub: number[] = [];
  stock: any[];
  time: any;

  public options = {
    position: ["buttom", "right"],
    timeOut: 5000,
    showProgressBar: false,
    lastOnBottom: true,
    clickToClose: true,
    preventDuplicates: true
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ServiceService: ServiceService,
    private spinnerService: SpinnerService,
    private toastyService: ToastyService,
    private notificationservice: NotificationsService,
    private toastyConfig: ToastyConfig,
    private zone: NgZone) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    this.username = localStorage.getItem('currentUser');
    //service for getting user information
    this.ServiceService.getDataFromServer(this.urlUserInfo)
      .subscribe(userdetails => {
        this.userdetails = userdetails;
        localStorage.setItem('currentUserEmail', userdetails.email_id);
        localStorage.setItem('currentUserContact', userdetails.contact_number);
      },
      (error: AppError) => {
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
      });


    //code to dynamically fetch the quantity of the items present in the cart immediately when the vendor updates it
    globalValues.setStockArray(JSON.parse(localStorage.getItem("StockAvailable")));
    this.stock = globalValues.stock;
    globalValues.setItemArray(JSON.parse(localStorage.getItem("cartItems")));
    if (JSON.parse(localStorage.getItem("Quantity"))) {
      globalValues.setQuantityArray(JSON.parse(localStorage.getItem("Quantity")));
    }
    if (JSON.parse(localStorage.getItem("cartItems"))) {
      for (let i = 0; i <= globalValues.Items.length; i++) {
        this.quantityAddSub.push(1);
        this.assign();
      }

      this.ServiceService.postDataToServer(this.urlForFetchingQuantity, globalValues.Items)
        .subscribe(res => {
          if (res.length > 0) {
            this.responseQuantity = res;
            for (var i = 0; i < globalValues.stock.length; i++) {
              globalValues.stock[i] = this.responseQuantity[i].quantity;

            }
            for (var i = 0; i < globalValues.quantity.length; i++) {
              if (globalValues.quantity[i] > globalValues.stock[i]) {
                globalValues.quantity[i] = 1;
              }
            }
            var notify = false;
            for (var i = 0; i < globalValues.quantity.length; i++) {
              if (globalValues.stock[i] == 0) {
                globalValues.Items.splice(i, 1);
                globalValues.quantity.splice(i, 1);
                globalValues.stock.splice(i, 1);
                notify = true;
              }
            }
            if (notify == true) {
              this.notificationservice.alert("Few items out of stock are automatically removed from the cart");
              this.updateCartNo();
            }
            if (globalValues.Items.length == 0) {
              this.showCart = false;
            }

            localStorage.setItem("cartItems", JSON.stringify(globalValues.Items));
            localStorage.setItem("StockAvailable", JSON.stringify(globalValues.stock));
            localStorage.setItem("Quantity", JSON.stringify(globalValues.quantity));
            this.router.navigate(['/navBar/cart']);
          }
          this.total();
        },
        (error: AppError) => {
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
        });
    }
    this.menuItem = globalValues.Items;
    if (JSON.parse(localStorage.getItem("cartItems"))) {
      if (this.menuItem.length > 0)
        this.showCart = true;
      this.total();
    }


  }
  //function to update the cart
  updateCartNo() {
    var route: ActivatedRoute;
    var router: Router;
    var ServiceService: ServiceService;
    var idle: Idle;
    var spinnerService: SpinnerService;
    var navbarObject = new NavbarComponent(route, router, ServiceService, spinnerService, idle);
    navbarObject.UdpateQuantity();
  }

  //Function to remove item from cart
  removeFromCart(item) {
    console.log("cart remove");
    let j: any;
    for (j in globalValues.Items) {

      if (globalValues.Items[j].foodItems == item.foodItems) {
        globalValues.Items.splice(j, 1);
        globalValues.quantity.splice(j, 1);
        globalValues.stock.splice(j, 1);
        this.assign();
        globalValues.setValue(globalValues.countItems - 1);
        this.total();
        var toastOptions: ToastOptions = {
          title: "",
          msg: item.foodItems + ' is removed from the Cart',
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
    if (globalValues.Items.length == 0) {
      this.showCart = false;
    }
    localStorage.setItem("cartItems", JSON.stringify(globalValues.Items));
    this.menuItem = JSON.parse(localStorage.getItem("cartItems"));
    localStorage.setItem("StockAvailable", JSON.stringify(globalValues.stock));
    this.stock = JSON.parse(localStorage.getItem("StockAvailable"));
    localStorage.setItem("Quantity", JSON.stringify(globalValues.quantity));
    globalValues.updateCartNumber();
  }

  //Function for comparing the stock level to the threshold value
  checkStockLevel(index) {
    if (this.stock[index] <= 20) {
      return true;
    }
    return false;
  }

  //Function for increasing the quantity of item
  add(index) {
    if (globalValues.quantity[index] >= this.stock[index]) {
      globalValues.quantity[index] = globalValues.quantity[index];
      this.notificationservice.error("Item quantity more than the stock of the item");
    }
    else
      globalValues.quantity[index] = globalValues.quantity[index] + 1;
    localStorage.setItem("Quantity", JSON.stringify(globalValues.quantity));
    this.assign();
    this.total();
  }

  //Function for decreasing the quantity of item
  substract(index) {
    if (globalValues.quantity[index] == 1) {
      globalValues.quantity[index] = 1;
    }
    else {
      globalValues.quantity[index] = globalValues.quantity[index] - 1;
      this.total();
    }
    localStorage.setItem("Quantity", JSON.stringify(globalValues.quantity));

    this.assign();
  }

  //Function for assigning the quantity of item
  assign() {
    this.quantityAddSub = globalValues.quantity;
  }


  //Function for calculating the total amount of cart
  total() {
    this.sum = 0;
    let i: any;
    for (i in globalValues.Items) {
      this.sum = this.sum + (globalValues.Items[i].ratePerPlate * globalValues.quantity[i]);

    }
    this.Money = (+this.sum) * 100;
    globalValues.setTotal(this.sum);
  }
  getDateTime() {
    var dateObj = new Date();
    var month, day, year, hour, min, sec: any;
    month = dateObj.getUTCMonth() + 1; //months from 1-12
    month = this.checkForSingledigit(month);
    day = dateObj.getUTCDate();
    day = this.checkForSingledigit(day);
    year = dateObj.getUTCFullYear();
    hour = dateObj.getHours();
    hour = this.checkForSingledigit(hour);
    min = dateObj.getMinutes();
    min = this.checkForSingledigit(min);
    this.today = day + "/" + month + "/" + year;
    this.time = hour + ":" + min;
  }
  generateOrderId() {
    this.orderid = Math.floor(Math.random() * 10000 + 1);
    var dateObj = new Date();
    var month, day, hour, min, sec: any;
    month = dateObj.getUTCMonth() + 1; //months from 1-12
    day = dateObj.getUTCDate();
    hour = dateObj.getHours();
    min = dateObj.getMinutes();
    sec = dateObj.getSeconds();
    month = this.checkForSingledigit(month);
    day = this.checkForSingledigit(day);
    hour = this.checkForSingledigit(hour);
    min = this.checkForSingledigit(min);
    this.orderid = this.orderid.toString() + day + month + hour + min + sec;
    globalValues.setOrderId(this.orderid);
    console.log(globalValues.orderId);
  }
  checkForSingledigit(param: any) {
    if (param < 10)
      param = "0" + param;
    return param;
  }

  getArrayOfItems() {
    globalValues.orderItems.splice(0);
    for (let i = 0; i < globalValues.Items.length; i++) {
      globalValues.orderItems.push(
        {
          "vendor_id": globalValues.Items[i].vendorId,
          "vendor_name": globalValues.Items[i].vendorName,
          "item_id": globalValues.Items[i].item_id,
          "item_name": globalValues.Items[i].foodItems,
          "category_id": globalValues.Items[i].categoryId,
          "category_name": globalValues.Items[i].categoryName,
          "quantity": globalValues.quantity[i],
          "amount": globalValues.Items[i].ratePerPlate,
          "serving_id": globalValues.Items[i].serving_id
        }
      );

    }
  }

  openCheckout(): void {

    this.getDateTime();
    // this.getCollectionTime();
    this.getArrayOfItems();
    this.generateOrderId()
    var options = {
      "key": "rzp_test_pUHSTJn4o5m96g",
      "amount": this.Money,// 2000 paise = INR 20
      "name": this.nameOfVendor,
      "description": "Purchase Description",
      // "image": "assets/FinalLogo.png",
      "handler": (response) => {
        this.payment_id = response.razorpay_payment_id;
        globalValues.setPayValue(this.payment_id)
        // this.generateOrderId();
        this.orderData = {
          "order_id": globalValues.orderId.toString(),
          "date": this.today,
          "user_id": this.username,
          "transaction_time": this.time,
          //  "collection_time" : this.collectionTime,
          //  "payment_gateway" : this.paymentMode,
          "total_amount": globalValues.totalOfCart,
          "order_status": this.orderStatus,
          "items": globalValues.orderItems,
          "payment_id": this.payment_id
        };

        console.log(this.orderData);

        //  service for post the data while payment                
        this.ServiceService.postDataToServer(this.urlForPayment, this.orderData)
          .subscribe(response => {
            if (response.order == "successfull") {
              console.log(response);
              globalValues.setValue(0);
              globalValues.Items.splice(0);
              globalValues.quantity.splice(0);
              globalValues.stock.splice(0);
              this.updateCartNo();
              localStorage.removeItem('StockAvailable');
              localStorage.removeItem('cartItems');
              localStorage.removeItem('Quantity');
              this.zone.run(() => this.goToOrderReceipt());
            }
            else if (response.order == "Mailer exception") {
              globalValues.setValue(0);
              globalValues.Items.splice(0);
              localStorage.removeItem('StockAvailable');
              localStorage.removeItem('cartItems');
              localStorage.removeItem('Quantity');
              globalValues.quantity.splice(0);
              globalValues.stock.splice(0);
              this.updateCartNo();
              alert("Order is successfully placed. As there is a problem with the mail service, you may not recieve a mail confirming the order");
              this.zone.run(() => this.goToOrderReceipt());

            }
            else if (response.order == "item Quantity exceeds") {
              alert("Order cannot be placed as the stock of the item is low. The items out of stock are automatically removed from the cart");
              this.ServiceService.postDataToServer(this.urlForFetchingQuantity, globalValues.Items)
                .subscribe(res => {
                  this.responseQuantity = res;
                  for (var i = 0; i < globalValues.stock.length; i++) {
                    globalValues.stock[i] = this.responseQuantity[i].quantity;

                  }
                  for (var i = 0; i < globalValues.quantity.length; i++) {
                    if (globalValues.quantity[i] > globalValues.stock[i]) {
                      globalValues.quantity[i] = 1;
                    }
                  }
                  for (var i = 0; i < globalValues.quantity.length; i++) {
                    if (globalValues.stock[i] == 0) {
                      globalValues.Items.splice(i, 1);
                      globalValues.quantity.splice(i, 1);
                      globalValues.stock.splice(i, 1);
                    }
                  }
                  globalValues.setValue(globalValues.Items.length);
                  this.updateCartNo();
                  localStorage.setItem("cartItems", JSON.stringify(globalValues.Items));
                  localStorage.setItem("StockAvailable", JSON.stringify(globalValues.stock));
                  localStorage.setItem("Quantity", JSON.stringify(globalValues.quantity));
                  this.router.navigate(['/navBar/cart']);
                })
            }
            else if (response.order == "unsuccessful") {
              alert("Order cannot be successfully placed as ther is issues in the server, place the order after sometime");
            }

          },
          (error: AppError) => {
            //  this.spinnerService.hide('mySpinner');
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
          });
        this.router.navigate(['/navBar/extra1'])
      },

      "prefill": {
        "contact": localStorage.getItem('currentUserContact'),
        "email": localStorage.getItem('currentUserEmail').toLowerCase()
      },

      "theme": {
        "color": "#F37254"
      },
      "modal": {
        "escape": function () { 
          this.router.navigate(['/navBar/cart'])
        }
   

      },
      "ondismiss": function () { 
        this.router.navigate(['/navBar/cart'])
      }


    };
    var rzp = new Razorpay(options);
    rzp.open();




  }
  goToOrderReceipt() {
    setTimeout(() => {
      this.router.navigate(['/navBar/orderReceipt']);
    }, 2000);
  }

}


