import { Board, Position } from "./types";

export const isKingInCheck = (board: Board, isWhite: boolean): boolean => {
  const king = isWhite ? '♔' : '♚';
  const opponentPawns = isWhite ? '♟︎' : '♙';
  const opponentKnights = isWhite ? '♞' : '♘';
  const opponentBishops = isWhite ? '♝' : '♗';
  const opponentRooks = isWhite ? '♜' : '♖';
  const opponentQueens = isWhite ? '♛' : '♕';
  
  const kingPosition = findKingPosition(board, king);

  if (isPawnThreat(board, kingPosition, opponentPawns, isWhite)) return true;
  if (isKnightThreat(board, kingPosition, opponentKnights)) return true;
  if (isDiagonalThreat(board, kingPosition, opponentBishops, opponentQueens) || 
      isStraightLineThreat(board, kingPosition, opponentRooks, opponentQueens)) return true;
  
  return false;
};

const findKingPosition = (board: Board, king: string): Position | never => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === king) {
        return { row, col };
      }
    }
  }

  throw new Error('No King on board')
};

const isPawnThreat = (board: Board, { row, col }: Position, opponentPawn: string, isWhite: boolean): boolean => {
  const direction = isWhite ? 1 : -1;

  return [col - 1, col + 1].some(c => board[row + direction]?.[c] === opponentPawn);
};

const isKnightThreat = (board: Board, { row, col }: Position, knight: string): boolean => {
  const knightMoves = [
    [row - 2, col - 1], [row - 2, col + 1],
    [row - 1, col - 2], [row - 1, col + 2],
    [row + 1, col - 2], [row + 1, col + 2],
    [row + 2, col - 1], [row + 2, col + 1]
  ];

  return knightMoves.some(([r, c]) => board[r]?.[c] === knight);
};

const isDiagonalThreat = (board: Board, { row, col }: Position, opponentBishop: string, opponentQueen: string): boolean => {
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return directions.some(([rowInc, colInc]) => {
    let r = row + rowInc, c = col + colInc;
    while (board[r]?.[c] === '') {
      r += rowInc;
      c += colInc;
    }

    return board[r]?.[c] === opponentBishop || board[r]?.[c] === opponentQueen;
  });
};

const isStraightLineThreat = (board: Board, { row, col }: Position, opponentRook: string, opponentQueen: string): boolean => {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  return directions.some(([rowInc, colInc]) => {
    let r = row + rowInc, c = col + colInc;
    while (board[r]?.[c] === '') {
      r += rowInc;
      c += colInc;
    }
    
    return board[r]?.[c] === opponentRook || board[r]?.[c] === opponentQueen;
  });
};

// Test Case 1: White King in check by a Black Rook
const boardInCheckWhiteRook: Board = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '♜', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '♔', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ];
  
  // Test Case 2: White King not in check
  const boardNotInCheckWhite: Board = [
    ['♜', '', '', '', '', '', '', ''],
    ['', '♔', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ];
  
  // Test Case 3: Black King in check by a White Queen
  const boardInCheckBlackQueen: Board = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '♚', '', '', '', '', ''],
    ['', '', '', '♕', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ];
  
  // Test Case 4: Black King not in check
  const boardNotInCheckBlack: Board = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '♚', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '♔', '', '', ''],
  ];
  
//   console.log('Test Case 1 (White King in check by Rook):', isKingInCheck(boardInCheckWhiteRook, true));
//   console.log('Test Case 2 (White King not in check):', isKingInCheck(boardNotInCheckWhite, true));
//   console.log('Test Case 3 (Black King in check by Queen):', isKingInCheck(boardInCheckBlackQueen, false));
//   console.log('Test Case 4 (Black King not in check):', isKingInCheck(boardNotInCheckBlack, false));
