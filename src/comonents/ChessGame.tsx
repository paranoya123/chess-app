import { isKingInCheck } from '@/isCheck';
import { isCheckMate } from '@/isCheckMate';
import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import DraggablePiece from './DraggablePiece';
import DroppableCell from './DroppableCell';
import { BLACKS, WHITES, initialBoardState, mapIconToFigure } from "@/constants";
import { isValidMove } from '@/moves';
import { Board } from '@/types';

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(initialBoardState);
  const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<boolean | null>(null);

  const move = (fromX: number, fromY: number, toX: number, toY: number) => {
    let currentBoard = board
    let currentTurn = isWhiteTurn
    setBoard(board => {
        currentBoard = board
        return board
    });
    setIsWhiteTurn(turn => {
        currentTurn = turn
        return turn
    });

    let newBoard = [...currentBoard.map(row => [...row])];
    const piece = newBoard[fromY][fromX];
    const key = mapIconToFigure[piece];

    if(currentTurn && BLACKS.includes(piece) || !currentTurn && WHITES.includes(piece)) return;
    
    if (piece && typeof isValidMove[key] === 'function' && isValidMove[key](newBoard, fromY, fromX, toY, toX)) {
      newBoard[fromY][fromX] = "";
      newBoard[toY][toX] = piece;

      if(isKingInCheck(newBoard, currentTurn)) return;

      setIsWhiteTurn(!currentTurn);
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
              onClick={() => {setWinner(null); setIsWhiteTurn(true); setBoard(initialBoardState);}}
            >
              Play Again
            </button>
          </>
        ) : (
          <>
            <div className={styles.turnText}>
              {isWhiteTurn ? 'Whites move' : 'Blacks move'}
            </div>
            {board.map((row, y) => (
              <div key={y} className={styles.chessboardRow}>
                {row.map((cell, x) => (
                  <DroppableCell key={x} x={x} y={y}>
                    <DraggablePiece x={x} y={y} piece={cell} movePiece={move} />
                  </DroppableCell>
                ))}
              </div>
            ))}
          </>
        )}
      </main>
    </DndProvider>
  );
}

