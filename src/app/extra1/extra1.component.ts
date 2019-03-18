import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-extra1',
  templateUrl: './extra1.component.html',
  styleUrls: ['./extra1.component.css']
})
export class Extra1Component implements OnInit {
  response_id: any;
  urlForOrderDetails: string;
  username: string;


  constructor(){} 

  ngOnInit() { }


}
