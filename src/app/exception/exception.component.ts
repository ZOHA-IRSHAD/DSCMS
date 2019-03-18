import { Component, OnInit } from '@angular/core';
import * as globalValues from "../Global-var-fun/globalVarFun";

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})

export class ExceptionComponent implements OnInit {

errorCode : number;
  constructor() { }

  ngOnInit() {
    this.errorCode = globalValues.errorCode;
  }

}
