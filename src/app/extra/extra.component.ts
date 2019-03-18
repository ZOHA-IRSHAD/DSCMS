import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as globalValues from "../Global-var-fun/globalVarFun";
// import { ServiceService } from "../services/service.service";

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.css']
})
export class ExtraComponent implements OnInit {
  
  constructor(private router : Router) { }

  ngOnInit() {
    console.log("extra");
    console.log(globalValues.orderId);
    console.log(globalValues.pay_id);
     setTimeout((router: Router) => {
        this.router.navigate(['/navBar/orderReceipt']);
    }, 1000);
      
  }
}

