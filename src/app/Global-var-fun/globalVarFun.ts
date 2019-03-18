
import { FoodMenuinterface } from "../Interfaces/FoodMenuinterface";
import { ItemsOfOrder } from "../Interfaces/items-of-order";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceService } from "../services/service.service";
import { Idle } from "@ng-idle/core";
import { SpinnerService } from "angular-spinners";
import { NavbarComponent } from "../navbar/navbar.component";

'use strict';
// Global Arrays
export let Items: Array<FoodMenuinterface> = [];
export  let stock :  Array<number> = [];
export let quantity: Array<number> = [];
export let orderItems: Array<ItemsOfOrder> = [];

//Global Variables
export let UserID: string;
export let countItems = 0;
export let totalOfCart: number;
export let checkedMenu = false;
export let orderId;
export let countRemember = 0;
export let ipAddress = "10.53.195.226:8080";
// "192.168.0.17:8080";//dscms.herokuapp.com
export let errorCode;
export let pay_id: string;

//Global Functions 
export function setValue(newValue: number) {
    countItems = newValue;


}
export function setPayValue(newPayValue: string) {
    pay_id = newPayValue;


}

export function setErrorCode(newErrorValue: number) {
    errorCode = newErrorValue;
}


export function setItemArray(newArray: any[]) {
    Items = newArray;
}
export function setStockArray(newArray: any[]) {
    stock = newArray;
}

export function setQuantityArray(newArray: any[]) {
    quantity = newArray;
}

export function getValue(): number {
    return countItems;
}

export function setRemember(newValue: number) {
    countRemember = newValue;
}

export function setUserId(userId) {
    UserID = userId;
}

export function setTotal(total) {
    totalOfCart = total;
}

export function setOrderId(orderid) {
    orderId = orderid;
}


export function updateCartNumber() {
    var route: ActivatedRoute;
    var router: Router;
    var ServiceService: ServiceService;
    var idle: Idle;
    var spinnerService: SpinnerService;
    var navbarObject = new NavbarComponent(route, router, ServiceService, spinnerService, idle);
    navbarObject.UdpateQuantity();
}
