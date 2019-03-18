import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  //Variables
  feedbackAnswer: any;

  constructor() { }

  ngOnInit() {
    this.feedbackAnswer = 'You can give feedback in My Orders tab (My Orders -> Order History -> History) of the application';
  }

}
