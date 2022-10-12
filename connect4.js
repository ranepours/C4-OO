/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1,p2,height=6,width=7){
    this.players = [p1,p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHTMLBoard();
    this.gameOver = false;
  };

  makeBoard(){
    this.board = [];
    for (let y = 0; y < this.height; y++){
      this.board.push(Array.from({length: this.width}));
    }
  };

  makeHTMLBoard(){
    const board = document.getElementById('board');
    board.innerHTML = "";

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    this.boardClick = this.handleClick.bind(this);
    top.addEventListener("click", this.boardClick);

    for(let x = 0; x < this.width; x++){
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    
    for (let y = 0; y < this.height; y++){
      const row = document.createElement("tr");
      for(let x = 0; x < this.width; x++){
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  };

  findSpot(x){
    for(let y = this.height -1; y >= 0; y--){
      if(!this.board[y][x]){
        return y;
      }
    } return null;
  };

  place(y,x){
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  };

  endGame(msg){
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.boardClick);
  };

  handleClick(e){
    const x = +e.target.id;
    const y = this.findSpot(x);
    if( y === null){
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.place(y,x);

    if (this.board.every(row => row.every(cell => cell))){
      return this.endGame(`No more moves. It's a draw.`);
    }
    if(this.win()){
      this.gameOver = true;
      return this.endGame(`No more moves, ${this.currPlayer.color} wins!`);
    }

    this.currPlayer = 
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  };

  win(){
    const winCheck = cells => cells
                              .every(([y,x]) =>  
                                        y >= 0 &&
                                        y < this.height &&
                                        x >= 0 &&
                                        x < this.width &&
                                        this.board[y][x] === this.currPlayer);
    for(let y = 0; y < this.height; y++){
      for(let x = 0; x < this.width; x++){
        const h = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const v = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const rightD = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const leftD = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        if (winCheck(h) || winCheck(v) || winCheck(rightD) || winCheck(leftD)){
          return true;
        }
      }
    }
  };
}

class Player {
  constructor(color){
    this.color = color;
  }
}

document.getElementById('start-game')
.addEventListener("click", () => {
  let p1 = new Player(document.getElementById("p1-color").value);
  let p2 = new Player(document.getElementById("p2-color").value);
  new Game(p1,p2);
})