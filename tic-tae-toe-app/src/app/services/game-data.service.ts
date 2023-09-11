import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  player1Mark : string = "";
  player2Cpu : boolean = false;
  scoreboardPlayer1 : number = 0;
  scoreboardPlayer2 : number = 0;
  scoreboardTies : number = 0;
  turn : string = 'x';

  constructor() { }

}
