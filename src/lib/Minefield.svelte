<script>
  export let difficulty;
  import {generateBoard} from './bombBoard.js'

  let boardSize = [];
  let bombCount = 0;

  switch(difficulty){
    case 'easy':
      boardSize = [8,8];
      bombCount = 10;
      break;
    case 'medium':
      boardSize = [16, 16];
      bombCount = 40;
      break;
    case 'hard':
      boardSize = [30,16];
      bombCount = 99;
      break;
  }
  let board = [];
  let cellStatuses = [];
  let playing = true;
  let boardGenerated = false;
  let gameStatus = `${bombCount} bombs remaining`;
  let bombsFlagged = 0;
  let cellsFlagged = 0;
  setup();
  function click(x, y, cell){
    if(playing){
      if(!boardGenerated){
        board = generateBoard(boardSize, bombCount, [x, y]);
        boardGenerated = true;
      }
      if(cellStatuses[y][x] != 'flagged'){
        if(cell == 'bomb'){
          gameOver();
          gameStatus = 'You Lose';
        }else if(cellStatuses[y][x] == 'unrevealed'){
          cellStatuses[y][x] = 'revealed';
          if(board[y][x] == ''){
            blankCheck(x, y);
          }
        }
        let unrevealedTiles = 0;
        cellStatuses.forEach(row => {
          row.forEach(status => {
            if(status == 'unrevealed'){
              unrevealedTiles += 1;
            }
          })
        })
        unrevealedTiles += bombsFlagged;
        if(unrevealedTiles == bombCount && cellsFlagged == bombsFlagged){
          gameOver();
          gameStatus = 'You Win';
        }
      }
    }
  }
  function rightClick(x, y){
    if(cellStatuses[y][x] != 'revealed' && playing){
      if(cellStatuses[y][x] != 'flagged'){
        cellStatuses[y][x] = 'flagged';
        cellsFlagged += 1;
        if(board[y][x] == 'bomb'){
          bombsFlagged += 1;
        }
      }else{
        cellStatuses[y][x] = 'unrevealed';
        cellsFlagged -= 1;
        if(board[y][x] == 'bomb'){
          if(bombsFlagged > 0){
            bombsFlagged -= 1;
          }
        }
      }
      gameStatus = `${bombCount-cellsFlagged} bombs remaining`;
      if(bombsFlagged == bombCount && cellsFlagged == bombsFlagged){
        gameOver();
        gameStatus = 'You Win';
      }
    }
  }

  function blankCheck(x, y){
    console.log(`checking ${x},${y}`)
    // up left down right
    // (0,0) == top left
    let directions = [y > 0, x > 0, y < boardSize[1]-1, x < boardSize[0]-1];
    // there are cells above it
    if(directions[0]){
      if(directions[1]){
        if(cellStatuses[y-1][x-1] == 'unrevealed'){
          cellStatuses[y-1][x-1] = 'revealed';
          if(board[y-1][x-1] == ''){
            blankCheck(x-1,y-1);
          }
        }
      }
      if(cellStatuses[y-1][x] == 'unrevealed'){
        cellStatuses[y-1][x] = 'revealed';
        if(board[y-1][x] == ''){
          blankCheck(x, y-1);
        }
      }
      if(directions[3]){
        if(cellStatuses[y-1][x+1] == 'unrevealed'){
          cellStatuses[y-1][x+1] = 'revealed';
          if(board[y-1][x+1] == ''){
            blankCheck(x+1,y-1);
          }
        }
      }
    }
    // there are cells to the left of it
    if(directions[1]){
      if(cellStatuses[y][x-1] == 'unrevealed'){
        cellStatuses[y][x-1] = 'revealed';
        if(board[y][x-1] == ''){
          blankCheck(x-1,y);
        }
      }
    }
    // there are cells below it
    if(directions[2]){
      if(directions[1]){
        if(cellStatuses[y+1][x-1] == 'unrevealed'){
          cellStatuses[y+1][x-1] = 'revealed';
          if(board[y+1][x-1] == ''){
            blankCheck(x-1,y+1);
          }
        }
      }
      if(cellStatuses[y+1][x] == 'unrevealed'){
        cellStatuses[y+1][x] = 'revealed';
        if(board[y+1][x] == ''){
          blankCheck(x, y+1);
        }
      }
      if(directions[3]){
        if(cellStatuses[y+1][x+1] == 'unrevealed'){
          cellStatuses[y+1][x+1] = 'revealed';
          if(board[y+1][x+1] == ''){
            blankCheck(x+1,y+1);
          }
        }
      }
    }
    if(directions[3]){
      if(cellStatuses[y][x+1] == 'unrevealed'){
        cellStatuses[y][x+1] = 'revealed';
        if(board[y][x+1] == ''){
          blankCheck(x+1,y);
        }
      }
    }
  }
  function gameOver(){
    playing = false;
    for(let y = 0; y < boardSize[0]; y++){
      for(let x = 0; x < boardSize[1]; x++){
        cellStatuses[x][y] == 'flagged' ? cellStatuses[x][y] = 'revealedFlag' : cellStatuses[x][y] = 'revealed';
      }
    }
  }
  function setup(){
    playing = true;
    boardGenerated = false;
    gameStatus =  `${bombCount} bombs remaining`;
    board = [];
    cellStatuses = [];
    bombsFlagged = 0;
    cellsFlagged = 0;
    for(let y = 0; y < boardSize[1]; y++){
      let row = [];
      let statusRow = [];
      for(let x = 0; x < boardSize[0]; x++){
        row.push('');
        statusRow.push('unrevealed')
      }
      board.push(row);
      cellStatuses.push(statusRow);
    }
  }
</script>

<div>
  <h2>{gameStatus}</h2>
  {#each board as row, rowIndex}
    <div class="row">
      {#each row as cell, cellIndex}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div on:click={() => click(cellIndex, rowIndex, cell)} on:contextmenu|preventDefault={() => rightClick(cellIndex, rowIndex)} class="cell {cellStatuses[rowIndex][cellIndex]}">{cell}</div>
      {/each}
    </div>
  {/each}
</div>
{#if !playing}
  <button on:click={setup}>RESTART</button>
{/if}

<style>
  .cell {
    width:5rem;
    height: 40px;
    font-size: 0.8rem;
    user-select: none;
    background-color: #383838;
    border: 1px;
    border-color: #323232;
    border-style: solid;
    text-align: center;
  }
  .unrevealed {
    cursor: pointer;
    color: transparent;
  }
  .revealed {
    cursor: default;
    color: white;
    background-color: #424242
  }
  .flagged {
    cursor: pointer;
    color: transparent;
    background-color: red;
  }
  .revealedFlag {
    cursor: default;
    color: white;
    background-color: red;
  }
  .row {
    display: flex;
  }
</style>