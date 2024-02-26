import { Board, Move } from "./types";
import { mapIconToFigure } from "./constants";
import { isValidMove } from "./moves";
import { isKingInCheck } from "./isCheck";

export const isCheckMate = (board: Board, isWhite: boolean): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece !== '' && isPieceColor(piece, isWhite)) {
        const legalMoves: Move[] = generateLegalMovesForPiece(board, row, col, isWhite, piece);
        for (const [newRow, newCol] of legalMoves) {
          const tempPiece = board[newRow][newCol];
          board[newRow][newCol] = piece;
          board[row][col] = '';
          const stillInCheck = isKingInCheck(board, isWhite);
          board[row][col] = piece;
          board[newRow][newCol] = tempPiece;

          if (!stillInCheck) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

const isPieceColor = (piece: string, isWhite: boolean): boolean => {
  const whitePieces: string[] = ['♔', '♕', '♖', '♗', '♘', '♙'];
  const blackPieces: string[] = ['♚', '♛', '♜', '♝', '♞', '♟︎'];
  return isWhite ? whitePieces.includes(piece) : blackPieces.includes(piece);
};

const generateLegalMovesForPiece = (board: Board, row: number, col: number, isWhite: boolean, piece: string): Move[] => {
    const figure = mapIconToFigure[piece]
    const moves = [] as Move[]

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(isValidMove[figure](board, row, col, i, j)){
                moves.push([i, j])
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

  