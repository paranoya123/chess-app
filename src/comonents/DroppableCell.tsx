import React from 'react';
import { useDrop } from 'react-dnd';
import styles from "@/styles/Home.module.css";
import { ItemTypes } from "@/constants";

interface DroppableCellProps {
  x: number;
  y: number;
  children: React.ReactNode;
}

const DroppableCell: React.FC<DroppableCellProps> = ({ x, y, children }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: () => ({ x, y }),
  }));

  const cellStyle = (x + y) % 2 === 0 ? styles.cellEven : styles.cellOdd;

  return <div ref={drop} className={`${styles.droppableCell} ${cellStyle}`}>{children}</div>;
};

export default DroppableCell;
