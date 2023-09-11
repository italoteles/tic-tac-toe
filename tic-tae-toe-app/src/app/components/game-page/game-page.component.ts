import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from 'src/app/services/game-data.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.sass']
})
export class GamePageComponent  implements OnInit {

  svgX : string = "<svg width='40' height='40' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'><path d='M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z' fill='#31C3BD' fill-rule='evenodd'/></svg>"
  svgO : string = "<svg width='40' height='40' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'><path d='M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z' fill='#F2B137'/></svg>"
  positions : number[] = [0,1,2,3,4,5,6,7,8];
  positionsX : number[] = [];
  positionsO : number[] = [];
  winPositions : number[][] = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  winnerPosition : number[] = []
  winnerMark : string = "";
  winnerPlayer : string = "";
  endMatch : boolean = false;



  @ViewChildren("gameBox") boxGameList: QueryList<ElementRef>;
  @ViewChild("container") container: ElementRef;

  constructor(private gameDataService : GameDataService, private router : Router){}


  ngOnInit(): void {
    if (this.gameDataService.player1Mark == ""){
      this.router.navigateByUrl('/start');
    }
  }

  public getGameDataService() : GameDataService{
    return this.gameDataService;
  }

  public markPosition(position : number, player : string, event : Event){
    if ((this.positionsX.indexOf(position) == -1) && (this.positionsO.indexOf(position) == -1) && (this.endMatch == false)){
      if (player === 'x'){
        this.positionsX.push(position);
        this.gameDataService.turn = 'o';
        (event.target as Element).innerHTML = this.svgX;
      }else{
        this.positionsO.push(position);
        this.gameDataService.turn = 'x';
        (event.target as Element).innerHTML = this.svgO;
      }


      this.endMatch = this.winCheck()

      if (this.endMatch){
        this.container.nativeElement.style.filter =  "blur(10px)";
      }

    }


  }

  public winCheck() : boolean{
    let result : boolean = false;


    this.winPositions.forEach(p => {
      if (p.every(element =>
        this.positionsX.includes(element))){
        result = true;
        this.winnerPosition = p;
        this.winnerMark = 'x';
        this.winnerPlayer = (this.winnerMark == this.gameDataService.player1Mark) ? 'PLAYER 1' : 'PLAYER 2'

        if(this.gameDataService.player1Mark == 'x')
          this.gameDataService.scoreboardPlayer1 += 1;
        else
          this.gameDataService.scoreboardPlayer2 += 1;
      }
      if (p.every(element =>
        this.positionsO.includes(element))){
        result = true;
        this.winnerPosition = p;
        this.winnerMark = 'o';
        this.winnerPlayer = (this.winnerMark == this.gameDataService.player1Mark) ? 'PLAYER 1' : 'PLAYER 2'
        if(this.gameDataService.player1Mark == 'o')
          this.gameDataService.scoreboardPlayer1 += 1;
        else
          this.gameDataService.scoreboardPlayer2 += 1;
      }

    });

    if ((this.positionsO.length + this.positionsX.length == 9) && (this.winnerMark == "")){
      this.gameDataService.scoreboardTies += 1;
      result = true
    }

    return result;


  }

  public restartGame() {
    this.positionsX  = [];
    this.positionsO  = [];
    this.winnerPosition  = [];
    this.winnerMark = "";
    this.gameDataService.turn = 'x';
    this.endMatch = false;
    this.container.nativeElement.style.filter =  "blur(0px)";
    this.winnerPlayer = "";

    this.boxGameList.forEach(element => {
      element.nativeElement.innerHTML = "";
    });
  }

  public quitGame(){

  }
}
