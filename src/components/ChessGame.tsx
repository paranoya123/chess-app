import { isKingInCheck } from '@/isCheck';
import { isCheckMate } from '@/isCheckMate';
import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import DraggablePiece from './DraggablePiece';
import DroppableCell from './DroppableCell';
import { BLACKS, BLACK_ROYALS, KING_BLACK, KING_WHITE, PAWN_BLACK, PAWN_WHITE, ROOK_BLACK, ROOK_WHITE, WHITES, WHITE_ROYALS, initialBoardState, mapIconToFigure } from "@/constants";
import { isValidMove } from '@/moves';
import { Board, Move } from '@/types';

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(initialBoardState);
  const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<boolean | null>(null);
  const [moves, setMoves] = useState<Move[]>([])
  const [kingMoved, setKingMoved] = useState({ white: false, black: false });
  const [capturedWhites, setCapturedWhites] = useState<string[]>([]);
  const [capturedBlacks, setCapturedBlacks] = useState<string[]>([]);
  const [rooksMoved, setRooksMoved] = useState({
    white: { left: false, right: false },
    black: { left: false, right: false },
  });
  const [shouldSelectBlack, setShouldSelectBlack] = useState(false)
  const [shouldSelectWhite, setShouldSelectWhite] = useState(false)
  const [changePosition, setChangePosition] = useState<[number, number]>([0, 0])

  const move = (fromX: number, fromY: number, toX: number, toY: number) => {
    if(shouldSelectBlack || shouldSelectWhite) return
    const newBoard = [...board.map(row => [...row])];
    const piece = newBoard[fromY][fromX];
    const key = mapIconToFigure[piece];
    const target = newBoard[toY][toX];

    if(isWhiteTurn && BLACKS.includes(piece) || !isWhiteTurn && WHITES.includes(piece)) return isWhiteTurn;
    
    if (piece && isValidMove[key](newBoard, fromY, fromX, toY, toX, isWhiteTurn ? kingMoved.white : kingMoved.black,
        isWhiteTurn ? rooksMoved.white.right : rooksMoved.black.right,
        isWhiteTurn ? rooksMoved.white.left : rooksMoved.black.left,
         true
      )) {
        newBoard[fromY][fromX] = "";
        newBoard[toY][toX] = piece;

        if (piece === KING_WHITE) setKingMoved(prev => ({ ...prev, white: true }));
        if (piece === KING_BLACK) setKingMoved(prev => ({ ...prev, black: true }));
        if (piece === ROOK_WHITE) {
            if (fromX === 0) setRooksMoved(prev => ({ ...prev, white: { ...prev.white, left: true } }));
            if (fromX === 7) setRooksMoved(prev => ({ ...prev, white: { ...prev.white, right: true } }));
        }
        if (piece === ROOK_BLACK) {
            if (fromX === 0) setRooksMoved(prev => ({ ...prev, black: { ...prev.black, left: true } }));
            if (fromX === 7) setRooksMoved(prev => ({ ...prev, black: { ...prev.black, right: true } }));
        }

        if (piece === PAWN_BLACK && toY === 0) {
            setShouldSelectBlack(true)
            setChangePosition([toY, toX])
        }
        if(piece === PAWN_WHITE && toY === 7){
            setShouldSelectWhite(true)
            setChangePosition([toY, toX])
        }

        if (target && WHITES.includes(target)) {
            setCapturedWhites(prev => [...prev, target]);
          } else if (target && BLACKS.includes(target)) {
            setCapturedBlacks(prev => [...prev, target]);
          }

        if(isKingInCheck(newBoard, isWhiteTurn)) return isWhiteTurn;

        setIsWhiteTurn(!isWhiteTurn);
        setBoard(newBoard);
    }
  };

  useEffect(() => {
    if(isCheckMate(board, isWhiteTurn)) setWinner(!isWhiteTurn);
  }, [board, isWhiteTurn]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Head>
        <title>Chess Game</title>
      </Head>
      <main>
        {winner !== null ? (
          <>
            <div className={styles.victoryMessage}>
              {winner ? 'Whites Victory!' : 'Blacks Victory!'}
            </div>
            <button
              className={styles.playAgainButton}
              onClick={() => {
                    setWinner(null);
                    setIsWhiteTurn(true);
                    setBoard(initialBoardState);
                    setKingMoved({ white: false, black: false });
                    setRooksMoved({
                        white: { left: false, right: false },
                        black: { left: false, right: false },
                    });
                }}
            >
              Play Again
            </button>
          </>
        ) : (
          <div className={styles.gameContainer}>
            <div className={styles.capturedPieces}>
                {capturedBlacks.map((piece) => (
                    <div key={piece} className={styles.capturedPieceBlack}>{piece}</div>
                ))}
            </div>
            <div>
            {shouldSelectWhite && <div className={styles.containerSwap}>{WHITE_ROYALS.map((p, i) => <div onClick={() => {
                        setShouldSelectWhite(false);
                        const [y, x] = changePosition;
                        const newBoard = [...board.map(row => [...row])];
                        newBoard[y][x] = p
                        setBoard(newBoard)
            }} key={i} className={styles.capturedPieceWhite}>{p}</div>)}</div>}
            {shouldSelectBlack && <div className={styles.containerSwap}>{BLACK_ROYALS.map((p, i) => <div onClick={() => {
                        setShouldSelectBlack(false);
                        const [y, x] = changePosition;
                        const newBoard = [...board.map(row => [...row])];
                        newBoard[y][x] = p
                        setBoard(newBoard)
            }} key={i} className={styles.capturedPieceBlack}>{p}</div>)}</div>}
            <div className={styles.turnText}>
              {isWhiteTurn ? 'Whites move' : 'Blacks move'}
            </div>
            {board.map((row, y) => (
              <div key={y} className={styles.chessboardRow}>
                {row.map((cell, x) => (
                  <DroppableCell key={x} x={x} y={y} moves={moves}>
                    <DraggablePiece x={x} y={y} piece={cell} movePiece={move} board={board} setMoves={setMoves}
                        kingMoved={kingMoved}
                        rooksMoved={rooksMoved}
                      />
                  </DroppableCell>
                ))}
              </div>
            ))}
            </div>
            <div className={styles.capturedPieces}>
                {capturedWhites.map((piece) => (
                    <div key={piece} className={styles.capturedPieceWhite}>{piece}</div>
                ))}
            </div>
          </div>
        )}
      </main>
    </DndProvider>
  );
}

