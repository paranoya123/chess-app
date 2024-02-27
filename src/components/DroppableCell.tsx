import React from 'react';
import { useDrop } from 'react-dnd';
import styles from "@/styles/Home.module.css";
import { ItemTypes } from "@/constants";
import { Move } from '@/types';

interface DroppableCellProps {
  x: number;
  y: number;
  children: React.ReactNode;
  moves: Move[]
}

const DroppableCell: React.FC<DroppableCellProps> = ({ x, y, children, moves }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: () => ({ x, y }),
  }));

  const cellStyle = (x + y) % 2 === 0 ? styles.cellEven : styles.cellOdd;
  const isHighlited = !!moves.find(([y1, x1]) => x1 === x && y === y1)?.length

  return <div ref={drop} style={{background: isHighlited ? 'green' : ''}} className={`${styles.droppableCell} ${cellStyle}`}>{children}</div>;
};

export default DroppableCell;
