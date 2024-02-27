import React, {useEffect, useState} from 'react';
import { useDrag } from 'react-dnd';
import styles from "@/styles/Home.module.css";
import { ItemTypes } from "@/constants"; 
import { BLACKS, mapWhiteIconToBlack } from '@/constants';
import { generateLegalMovesForPiece } from '@/isCheckMate';
import { Board , Move} from '@/types';

interface DraggablePieceProps {
  x: number;
  y: number;
  piece: string;
  movePiece: (fromX: number, fromY: number, toX: number, toY: number) => void;
  setMoves: (moves: Move[]) => void;
  board: Board;
  kingMoved: {black: boolean, white: boolean};
  rooksMoved: {black: {left: boolean, right: boolean}, white: {left: boolean, right: boolean}};
}

const DraggablePiece: React.FC<DraggablePieceProps> = ({ x, y, piece, movePiece, setMoves, board, kingMoved, rooksMoved }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { x, y },
    end: (item: { x: number; y: number } | undefined, monitor) => {
      const dropResult = monitor.getDropResult<{ x: number; y: number }>();
      if (item && dropResult) {
        movePiece(item.x, item.y, dropResult.x, dropResult.y);
      }
      setMoves([])
    },
    collect: (monitor) => ({isDragging: !!monitor.isDragging()}),
  }), [movePiece]);

  useEffect(() => {
    if(isDragging){
        setMoves(generateLegalMovesForPiece(board, y ,x, kingMoved, rooksMoved))
    } else {
        setMoves([])
    }
  }, [isDragging])

  const renderPiece = (piece: string) => BLACKS.includes(piece) ? piece : mapWhiteIconToBlack[piece]

  return (
    <div ref={drag} className={styles.draggablePiece}
     style={{ opacity: isDragging ? 0.5 : 1, color: BLACKS.includes(piece) ? 'black': 'white'}}>
      {renderPiece(piece)}
    </div>
  );
};

export default DraggablePiece;
