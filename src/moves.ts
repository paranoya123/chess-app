import { Board } from "./types";
import { WHITES, BLACKS, ROOK_BLACK, ROOK_WHITE } from "./constants";
import { isKingInCheck } from "./isCheck";

const stepOnMate = (board: Board, startRow: number, startCol: number, endRow: number, endCol: number) => {
    if (WHITES.includes(board[startRow][startCol]) ? WHITES.includes(board[endRow][endCol]) : BLACKS.includes(board[endRow][endCol])) {
        return true;
    }

    return false;
}

interface MoveFunction {
    (board: Board,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    isKingMoved?: boolean, 
    isRightRookMoved?: boolean,
    isLeftRookMoved?: boolean,
    withUpdate?: boolean,
    ): boolean;
 }
  
interface IsValidMove {
  [key: string]: MoveFunction;
}

export const isValidMove: IsValidMove = {
    rook: (board: Board, startRow: number, startCol: number, endRow: number, endCol: number) => {
          if(stepOnMate(board, startRow, startCol, endRow, endCol)) return false;

          if (startRow !== endRow && startCol !== endCol) {
            return false;
          }
        
          const rowDiff = endRow - startRow;
          const colDiff = endCol - startCol;
          const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
          const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
        
          let currentRow = startRow + rowStep;
          let currentCol = startCol + colStep;
        
          while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== "") {
              return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
          }
        
          return true;
    },
    knight: (board: Board, startRow: number, startCol: number, endRow: number, endCol: number) => {
        if(stepOnMate(board, startRow, startCol, endRow, endCol)) return false;

        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        
    },
    bishop: (board: Board, startRow: number, startCol: number, endRow: number, endCol: number) => {
          if(stepOnMate(board, startRow, startCol, endRow, endCol)) return false;

          const rowDiff = endRow - startRow;
          const colDiff = endCol - startCol;
          if (Math.abs(rowDiff) !== Math.abs(colDiff)) {
            return false;
          }
        
          const rowStep = rowDiff / Math.abs(rowDiff);
          const colStep = colDiff / Math.abs(colDiff);
        
          let currentRow = startRow + rowStep;
          let currentCol = startCol + colStep;
        
          while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== "") {
              return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
          }
        
          return true;
    },
    queen: (board: Board, startRow: number, startCol: number, endRow: number, endCol: number) => {
          if(stepOnMate(board, startRow, startCol, endRow, endCol)) return false;

          const rowDiff = endRow - startRow;
          const colDiff = endCol - startCol;
          const absRowDiff = Math.abs(rowDiff);
          const absColDiff = Math.abs(colDiff);
        
          if (absRowDiff !== absColDiff && rowDiff !== 0 && colDiff !== 0) {
            return false;
          }
        
          const rowStep = rowDiff === 0 ? 0 : rowDiff / absRowDiff;
          const colStep = colDiff === 0 ? 0 : colDiff / absColDiff;
        
          let currentRow = startRow + rowStep;
          let currentCol = startCol + colStep;
        
          while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== "") {
              return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
          }
        
          return true;
    },
    king: (board: Board, startRow: number, startCol: number, endRow: number, endCol: number,
      isKingMoved?: boolean, isRightRookMoved?: boolean, isLeftRookMoved?: boolean, withUpdate?: boolean) => {
      const isWhite = WHITES.includes(board[startRow][startCol]);

      if (stepOnMate(board, startRow, startCol, endRow, endCol)) return false;

      const rowDiff = Math.abs(endRow - startRow);
      const colDiff = Math.abs(endCol - startCol);

      if (rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)) {
        return true;
      }

      // Castling check
      if (!isKingMoved && rowDiff === 0 && (colDiff === 2 || colDiff === 3)) {
        const direction = endCol - startCol > 0 ? 'right' : 'left';
        const rookCol = direction === 'right' ? 7 : 0;
        const isRookMoved = direction === 'right' ? isRightRookMoved : isLeftRookMoved;
        const pathClear = isPathClearForCastling(board, startRow, startCol, direction, isWhite);

        if (!isRookMoved && pathClear && !isKingInCheck(board, isWhite)) {
          const rookDestinationCol = direction === 'right' ? endCol - 1 : endCol + 1;
          if(withUpdate){
            board[startRow][rookCol] = '';
            board[startRow][rookDestinationCol] = isWhite ? ROOK_WHITE : ROOK_BLACK;
          }

          return true;
        }
      }

      return false;
    },
    pawn: (board: Board, startRow: number, startCol: number, endRow: number, endCol: number) => {
        if(stepOnMate(board, startRow, startCol, endRow, endCol)) return false;

        const isWhite = WHITES.includes(board[startRow][startCol])
        const forward = isWhite ? 1 : -1;
        const initialRow = isWhite ? 1 : 6;
        let moveIsValid = false;

        if (startCol === endCol) {
            if (startRow + forward === endRow && board[endRow][endCol] === "") {
                moveIsValid = true;
            }

            if (startRow === initialRow && startRow + 2 * forward === endRow && board[endRow][endCol] === "" && board[startRow + forward][startCol] === "") {
                moveIsValid = true;
            }
        }

        if (Math.abs(startCol - endCol) === 1 && startRow + forward === endRow) {
            if (board[endRow][endCol] !== "" && board[endRow][endCol] !== " ") {
                moveIsValid = true;
            }
        }

        return moveIsValid;
    },
}

function isPathClearForCastling(board: Board, row: number, startCol: number, direction: 'right' | 'left', isWhite: boolean) {
  const endCol = direction === 'right' ? 7 : 0;
  const step = direction === 'right' ? 1 : -1;

  for (let col = startCol + step; col !== endCol; col += step) {
    if (board[row][col] !== '') {
      return false;
    }

    let tempKingPos = board[row][startCol];
    board[row][startCol] = '';
    board[row][col] = tempKingPos;
    if (isKingInCheck(board, isWhite)) {
      board[row][col] = '';
      board[row][startCol] = tempKingPos;
      return false;
    }
    board[row][col] = '';
    board[row][startCol] = tempKingPos; 
  }

  return true;
}
