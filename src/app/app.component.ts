import { Component } from '@angular/core';
import {Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router, ActivatedRoute } from "@angular/router";
import {Http, Headers} from "@angular/http";
import * as globalValues from "./Global-var-fun/globalVarFun";
import {NgClass} from '@angular/common';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import { ServiceService } from "./services/service.service";
import { SpinnerService } from "angular-spinners";
import { NavbarComponent } from "./navbar/navbar.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
title = 'app';

      constructor(private router: Router,
                  private http: Http,
                  private ServiceService: ServiceService,
                  private idle: Idle) 
      {

        // idle.setIdle(240);
        // idle.setTimeout(300);
        // idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        
        // idle.onTimeout.subscribe(() => {
        // alert('Timeout');
        // localStorage.clear();
        // globalValues.setItemArray([]);
        // globalValues.updateCartNumber();
        // this.router.navigate(['/']);
        // });
        // idle.watch();
      }
}
