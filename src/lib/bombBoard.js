export function generateBoard(boardSize, bombCount, startingCell){
    let board = [];
    // make blank board
    for(let i = 0; i < boardSize[1]; i++){
        let col = [];
        for(let j = 0; j < boardSize[0]; j++){
            col[j] = ''
        }
        board[i] = col;
    }
    // generate bombs
    function addBombs(bombCount){
        for(let i = 0; i < bombCount; i++){
            let randomCell = [Math.floor(Math.random()*boardSize[0]), Math.floor(Math.random()*boardSize[1])];
            if(board[randomCell[1]][randomCell[0]] != 'bomb' && startingCell.toString() != randomCell.toString()){
                board[randomCell[1]][randomCell[0]] = 'bomb';
            }else{
                addBombs(1);
            }
        }
    }
    addBombs(bombCount);
    let cellBombs = [];
    for(let i = 0; i < boardSize[1]; i++){
        let bombRow = [];
        for(let j = 0; j < boardSize[0]; j++){
            let bombsRadar = 0;
            // up left down right
            let directions = [i > 0, j > 0, i < boardSize[1]-1, j < boardSize[0]-1];
            if(directions[0]){
                if(directions[1]){
                    if(board[i-1][j-1] == 'bomb'){
                        bombsRadar += 1;
                    }
                }
                if(board[i-1][j] == 'bomb'){
                    bombsRadar += 1;
                }
                if(directions[3]){
                    if(board[i-1][j+1] == 'bomb'){
                        bombsRadar += 1;
                    }
                }
            }
            if(directions[1]){
                if(board[i][j-1] == 'bomb'){
                    bombsRadar += 1;
                }
            }
            if(directions[2]){
                if(directions[1]){
                    if(board[i+1][j-1] == 'bomb'){
                        bombsRadar += 1;
                    }
                }
                if(board[i+1][j] == 'bomb'){
                    bombsRadar += 1;
                }
                if(directions[3]){
                    if(board[i+1][j+1] == 'bomb'){
                        bombsRadar += 1;
                    }
                }
            }
            if(directions[3]){
                if(board[i][j+1] == 'bomb'){
                    bombsRadar += 1;
                }
            }
            bombRow[j] = bombsRadar;
        }
        cellBombs[i] = bombRow;
    }
    board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if(cell != 'bomb'){
                if(cellBombs[rowIndex][cellIndex] == 0){
                    board[rowIndex][cellIndex] = '';
                }else{
                    board[rowIndex][cellIndex] = cellBombs[rowIndex][cellIndex];
                }
            }
        })
    });

    return board;
}