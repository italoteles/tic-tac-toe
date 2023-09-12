import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Router } from '@angular/router';
import { repeat } from 'rxjs';
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
  modalRestartMatch : boolean = false;
  disableBox : boolean = false;
  modalEndMatch : boolean;



  @ViewChildren("gameBox") boxGameList: QueryList<ElementRef>;
  @ViewChild("container") container: ElementRef;

  constructor(private gameDataService : GameDataService, private router : Router){}


  ngOnInit(): void {
    if (this.gameDataService.player1Mark == ""){
      this.router.navigateByUrl('/start');
    }

    if ((this.gameDataService.player2Cpu) && (this.gameDataService.player2Mark=='x')){

      this.markPosition(null,null);
    }

  }

  public getGameDataService() : GameDataService{
    return this.gameDataService;
  }

  public markPosition(position : number, event : Event){


    let playerTurn : string = this.gameDataService.turn;


    if (((this.gameDataService.player2Cpu) && (playerTurn === this.gameDataService.player1Mark)) || (this.gameDataService.player2Cpu == false)){
      if ((this.positionsX.indexOf(position) == -1) && (this.positionsO.indexOf(position) == -1) && (this.endMatch == false)){

        if (playerTurn === 'x'){
          this.positionsX.push(position);
          (event.target as Element).innerHTML = this.svgX;
          this.gameDataService.turn = 'o';
        }else{
          this.positionsO.push(position);
          (event.target as Element).innerHTML = this.svgO;
          this.gameDataService.turn = 'x';
        }

      }
    }

    this.endMatch = this.winCheck()
    if (this.endMatch){
      setTimeout(() => {
        this.modalEndMatch = this.endMatch;
        this.container.nativeElement.style.filter =  "blur(10px)";
      },1500);
    }

    if (((this.gameDataService.player2Cpu) && (playerTurn === this.gameDataService.player1Mark) && (this.endMatch == false)) || (event == null))
    {
      this.disableBox = true;
      setTimeout(() => {
        let validPosition = this.pcValidPosition();

        let boxGame : ElementRef = this.boxGameList.find(element => {
          return element.nativeElement.id == 'game-board-'+validPosition
        });



        if (this.gameDataService.turn === 'x'){
          this.positionsX.push(validPosition);
          this.gameDataService.turn = 'o';
          boxGame.nativeElement.innerHTML = this.svgX;
        }else{
          this.positionsO.push(validPosition);
          this.gameDataService.turn = 'x';
          boxGame.nativeElement.innerHTML =  this.svgO;
      }
      if (this.endMatch == false){
        this.endMatch = this.winCheck()
        if (this.endMatch){
          setTimeout(() => {
            this.modalEndMatch = this.endMatch;
            this.container.nativeElement.style.filter =  "blur(10px)";
          },1500);
        }
      }

      }, 1000);

      this.disableBox = false;


    }




  }

  public winCheck() : boolean{
    let result : boolean = false;


    for (let index = 0; index < this.winPositions.length; index++)
    {
      let p : number[] = this.winPositions[index];
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
          break;

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
          break;
      }

    };

    if ((this.positionsO.length + this.positionsX.length == 9) && (this.winnerMark == "")){
      this.gameDataService.scoreboardTies += 1;
      result = true
    }

    if (result){
      this.paintWinnerPosition();
    }

    return result;


  }
  public cancel(){
    this.modalRestartMatch = false;
    this.container.nativeElement.style.filter =  "blur(0px)";
  }
  public confirmRestart(){
    this.modalRestartMatch = true;
    this.container.nativeElement.style.filter =  "blur(10px)";
  }

  public restartGame() {
    this.modalRestartMatch = false;
    this.positionsX  = [];
    this.positionsO  = [];
    this.winnerPosition  = [];
    this.winnerMark = "";
    this.gameDataService.turn = 'x';
    this.endMatch = false;
    this.modalEndMatch = false
    this.container.nativeElement.style.filter =  "blur(0px)";
    this.winnerPlayer = "";

    this.boxGameList.forEach(element => {
      element.nativeElement.innerHTML = "";
      element.nativeElement.style = 'background-color: $semi-dark-navy'
    });

    if ((this.gameDataService.player2Cpu) && (this.gameDataService.player2Mark=='x')){

      this.markPosition(null,null);
    }
  }

  public quitGame(){
    this.restartGame();
    this.gameDataService.player1Mark = "";
    this.gameDataService.player2Mark = "";
    this.gameDataService.player2Cpu = false;
    this.gameDataService.scoreboardPlayer1 = 0;
    this.gameDataService.scoreboardPlayer2 = 0;
    this.gameDataService.scoreboardTies = 0;
    this.gameDataService.turn = 'x';

    this.router.navigateByUrl('/start');
  }

  public pcValidPosition() : number{

    let randomPosition : number;
    let validPosition : boolean = false;

    for (let index = 0; validPosition == false; index++) {
      randomPosition = Math.floor(Math.random() * 9);
      if ((this.positionsX.indexOf(randomPosition) == -1) && (this.positionsO.indexOf(randomPosition) == -1)){
        validPosition = true;
      }
    }

    return randomPosition;
  }

  public paintWinnerPosition(){
    if (this.winnerPosition.length){

      this.winnerPosition.forEach(position => {
        let boxGame : ElementRef = this.boxGameList.find(element => {
          return element.nativeElement.id == 'game-board-'+position
        });

        boxGame.nativeElement.style = 'background-color: green'

      });



    }
  }



}

