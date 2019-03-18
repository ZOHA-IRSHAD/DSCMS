
import { Slide6interface } from "./slide6interface";
import { ItemsOfOrder } from "./items-of-order";

'use strict';
// Global Arrays
export let Items : Array<Slide6interface> =[];
export let stock : Array<number>=[]; 
export let quantity : Array<number>=[];
export let orderItems : Array<ItemsOfOrder>=[];

//Global Variables
export let UserID : string ; 
export let countItems = 0;
export let totalOfCart : number;
export let checkedMenu = false;
export let orderId;
export let countRemember = 0;
export let ipAddress =  "dscms.herokuapp.com"; //dscms.herokuapp.com
// export declare var Razorpay:any;

//Global Functions 
export function setValue(newValue: number)
{
    countItems = newValue;
}

export function getValue() : number 
{
      return countItems;
}

export function setRemember(newValue: number)
{
    countRemember = newValue;
}

export function setUserId(userId)
{
    UserID = userId;
}

export function setTotal(total)
{
    totalOfCart = total;
}

export function setOrderId(orderid)
{
    orderId = orderid;
}