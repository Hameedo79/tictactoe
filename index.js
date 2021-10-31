document.addEventListener('DOMContentLoaded', (e) => {
  const playButton = document.getElementById('resetGame');

  let xWin = 0;
  let oWin = 0;

  playButton.addEventListener('click', () => {
    const boardSize = parseInt(document.getElementById('boardSize').value);

    if (isNaN(boardSize) || boardSize < 3) {
      alert('Try enter 3 or more in the board size.');
      return false;
    }

    const totalBlock = Math.pow(boardSize, 2);
    const board = document.getElementById('board');
    const xCountWinLabel = document.getElementById('countWinX');
    const oCountWinLabel = document.getElementById('countWinO');

    const gameState = new Array(boardSize * 2 + 2);
    gameState.fill(0);
    let playerTurnIndicator = 0;
    let shouldRestart = false;

    board.style.width = boardSize * 100 + 'px';
    board.innerHTML = '';
    let row = 0;
    let column = 0;
    for (let i = 1; i <= totalBlock; i++) {
      if (column >= boardSize) column = 0;

      if (boardSize % 2 === 0) {
        const isEvenRow = Math.ceil(i / boardSize) % 2 == 0;
        const alternateBlock = i % 2 == isEvenRow;
        board.innerHTML += (alternateBlock)
          ? "<div data-row='"+ row +"' data-column='"+ column +"' class='block dark'></div>"
          : "<div data-row='"+ row +"' data-column='"+ column +"' class='block light'></div>";
      } else {
        const blockStyle = (i % 2 === 0) ? 'dark' : 'light';
        board.innerHTML += "<div data-row='"+ row +"' data-column='"+ column +"' class='block "+ blockStyle +"'></div>";
      }

      column++;
      if (i % boardSize === 0) row += 1;
    }

    const blocks = document.getElementsByClassName('block');

    for (let j = 0; j < blocks.length; j++) {
      blocks[j].addEventListener('click', function () {
        if (shouldRestart) {
          const answer = confirm('The game is over, do you want to play again?');
          if (answer) {
            return playButton.click();
          } else {
            return false
          }
        }

        if (this.innerHTML !== '') {
          alert('You need to click another block');
          return false;
        } else {
          const row = parseInt(this.dataset.row);
          const column = parseInt(this.dataset.column);
          if (playerTurnIndicator % 2 === 0) {
            this.classList.add('isX');
            this.innerHTML = 'X';
            checkWinner('x', row, column);
          } else {
            this.classList.add('isO');
            this.innerHTML = 'O';
            checkWinner('o', row, column);
          }

          playerTurnIndicator++;
        }
      })
    }

    const checkWinner = (player, row, column) => {
      let point = (player === 'x') ? 1 : -1;

      gameState[row] += point;

      gameState[boardSize + column] += point;

      if (row === column) {
        gameState[2 * boardSize] += point;
      }

      if (row + column === boardSize - 1) {
        gameState [2 * boardSize + 1] += point;
      }

      const xWins = gameState.indexOf(boardSize);
      const oWins = gameState.indexOf(-boardSize);

      if (xWins >= 0) {
        shouldRestart = true;
        xWin += 1;
        xCountWinLabel.value = xWin;

        if(xWin >= 2){
          document.getElementById('xTimes').innerHTML = 'times';
        }else{
          document.getElementById('xTimes').innerHTML = 'time';
        }

        alert('X win');
        return true;
      } else if (oWins >= 0) {
        shouldRestart = true;
        oWin += 1;
        oCountWinLabel.value = oWin;

        if(oWin >= 2){
          document.getElementById('oTimes').innerHTML = 'times';
        }else{
          document.getElementById('oTimes').innerHTML = 'time';
        }

        alert('O win');
        return true;
      }

      if (playerTurnIndicator === totalBlock - 1) {
        shouldRestart = true;
        alert("It's a draw!");
        return false;
      }
    }
  });
});