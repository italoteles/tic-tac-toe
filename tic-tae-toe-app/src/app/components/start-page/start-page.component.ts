import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from 'src/app/services/game-data.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.sass']
})
export class StartPageComponent {

  constructor(private router : Router, private gameDataService : GameDataService){}

  xSelected : boolean = true;

  chooseX(){
    this.xSelected = true;

  }
  chooseO(){
    this.xSelected = false;

  }
  newGameVsPc(){
    this.gameDataService.player1Mark = (this.xSelected ? 'x' : 'o');
    this.gameDataService.player2Mark = (this.xSelected ? 'o' : 'x');
    this.gameDataService.player2Cpu = true;
    this.router.navigateByUrl('/game');
  }
  newGameVsPlayer(){
    this.gameDataService.player1Mark = (this.xSelected ? 'x' : 'o');
    this.gameDataService.player2Mark = (this.xSelected ? 'o' : 'x');
    this.gameDataService.player2Cpu = false;
    this.router.navigateByUrl('/game');
  }


}
