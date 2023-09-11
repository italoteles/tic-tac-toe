import { Component } from '@angular/core';
import { GameDataService } from 'src/app/services/game-data.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.sass']
})
export class GamePageComponent {

  constructor(private gameDataService : GameDataService){}

  // public currentTurn() : string{
  //   return this.gameDataService.turn;
  // }

  public getGameDataService() : GameDataService{
    return this.gameDataService;
  }
}
