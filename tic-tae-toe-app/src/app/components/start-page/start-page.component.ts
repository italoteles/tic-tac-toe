import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.sass']
})
export class StartPageComponent {

  constructor(private router : Router){}

  xSelected : boolean = false;

  chooseX(){
    this.xSelected = true;

  }
  chooseO(){
    this.xSelected = false;

  }
  newGameVsPc(){
    this.router.navigateByUrl('/game');
  }


}
