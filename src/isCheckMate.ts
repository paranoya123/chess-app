import { Board, Move } from "./types";
import { mapIconToFigure } from "./constants";
import { isValidMove } from "./moves";
import { isKingInCheck } from "./isCheck";
import { BLACKS, WHITES } from "./constants";

export const isCheckMate = (board: Board, isWhite: boolean): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] && isPieceColor(board[row][col], isWhite)) {
        const legalMoves: Move[] = generateLegalMovesForPiece(board, row, col);

        if(legalMoves.length){
            return false
        }
      }
    }
  }

  return true;
};

const isPieceColor = (piece: string, isWhite: boolean): boolean => {
    return isWhite ? WHITES.includes(piece) : BLACKS.includes(piece);
  };

export const generateLegalMovesForPiece = (board: Board, row: number, col: number, kingMoved?: {black: boolean, white: boolean},
     rooksMoved?: {black: {left: boolean, right: boolean}, white: {left: boolean, right: boolean}}): Move[] => {
    const figure = mapIconToFigure[board[row][col]]
    const isWhite = WHITES.includes(board[row][col])
    const moves = [] as Move[]

    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(isValidMove[figure](board, row, col, i, j, isWhite ? kingMoved?.white : kingMoved?.black,
                isWhite ? rooksMoved?.white.right : rooksMoved?.black.right,
                isWhite ? rooksMoved?.white.left : rooksMoved?.black.left,)){
                const newBoard = [...board.map(row => [...row])];
                newBoard[i][j] = board[row][col];
                newBoard[row][col] = '';
                const stillInCheck = isKingInCheck(newBoard, isWhite);

                if(!stillInCheck) moves.push([i, j])
            }
        }
    }
  return moves;
};

// Test Case 1: Black King in checkmate by a White Rook and King
const boardCheckmateWhite: Board = [
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟︎","♟︎","♟︎","♟︎","♟︎","","","♟︎"],
    ["","","","","","♟︎","",""],
    ["","","","","","","♟︎","♕"],
    ["","","","","♙","","",""],
    ["","","","","","","",""],
    ["♙","♙","♙","♙","","♙","♙","♙"],
    ["♖","♘","♗","","♔","♗","♘","♖"]
]

  
  console.log('Test Case 1 (White King in check):', isCheckMate(boardCheckmateWhite, false));
  
  console.log('Test Case 1 (White King in checkmate):', isCheckMate(boardCheckmateWhite, false));

  