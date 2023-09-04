import { Component } from '@angular/core';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.sass']
})
export class StartPageComponent {

  xSelected : boolean = false;

  chooseX(){
    this.xSelected = true;

  }
  chooseO(){
    this.xSelected = false;

  }


}
