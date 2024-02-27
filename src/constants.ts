export const KING_WHITE = '♔';
export const QUEEN_WHITE = '♕';
export const PAWN_WHITE = '♙';
export const KNIGHT_WHITE = '♘';
export const ROOK_WHITE = '♖';
export const BISHOP_WHITE = '♗';

export const KING_BLACK = '♚';
export const QUEEN_BLACK = '♛';
export const PAWN_BLACK = '♟︎';
export const KNIGHT_BLACK = '♞';
export const ROOK_BLACK = '♜';
export const BISHOP_BLACK = '♝';


export const WHITES = [KING_WHITE, QUEEN_WHITE, PAWN_WHITE, KNIGHT_WHITE, ROOK_WHITE, BISHOP_WHITE]
export const BLACKS = [KING_BLACK, QUEEN_BLACK, PAWN_BLACK, KNIGHT_BLACK, ROOK_BLACK, BISHOP_BLACK]

export const WHITE_ROYALS = [QUEEN_WHITE, KNIGHT_WHITE, ROOK_WHITE, BISHOP_WHITE]
export const BLACK_ROYALS = [QUEEN_BLACK, KNIGHT_BLACK, ROOK_BLACK, BISHOP_BLACK]

export const initialBoardState = [
  [ROOK_WHITE, KNIGHT_WHITE, BISHOP_WHITE, QUEEN_WHITE, KING_WHITE, BISHOP_WHITE, KNIGHT_WHITE, ROOK_WHITE],
  [PAWN_WHITE, PAWN_WHITE, PAWN_WHITE, PAWN_WHITE, PAWN_WHITE, PAWN_WHITE, PAWN_WHITE, PAWN_WHITE],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    [PAWN_BLACK, PAWN_BLACK, PAWN_BLACK, PAWN_BLACK, PAWN_BLACK, PAWN_BLACK, PAWN_BLACK, PAWN_BLACK],
    [ROOK_BLACK, KNIGHT_BLACK, BISHOP_BLACK, QUEEN_BLACK, KING_BLACK, BISHOP_BLACK, KNIGHT_BLACK, ROOK_BLACK],
  ];

interface MapIconToFigure {
    [key: string]: string;
}

 export const mapIconToFigure: MapIconToFigure = {
    [KING_WHITE]: 'king',
    [KNIGHT_WHITE]: 'knight',
    [QUEEN_WHITE]: 'queen',
    [ROOK_WHITE]: 'rook',
    [BISHOP_WHITE]: 'bishop',
    [PAWN_WHITE]: 'pawn',

    [KING_BLACK]: 'king',
    [KNIGHT_BLACK]: 'knight',
    [QUEEN_BLACK]: 'queen',
    [ROOK_BLACK]: 'rook',
    [BISHOP_BLACK]: 'bishop',
    [PAWN_BLACK]: 'pawn',
 }

 export const mapWhiteIconToBlack: MapIconToFigure = {
  [KING_WHITE]: KING_BLACK,
  [KNIGHT_WHITE]: KNIGHT_BLACK,
  [QUEEN_WHITE]: QUEEN_BLACK,
  [ROOK_WHITE]: ROOK_BLACK,
  [BISHOP_WHITE]: BISHOP_BLACK,
  [PAWN_WHITE]: PAWN_BLACK
}

 export const ItemTypes = {
  PIECE: 'piece',
};