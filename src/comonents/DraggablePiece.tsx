import React from 'react';
import { useDrag } from 'react-dnd';
import styles from "@/styles/Home.module.css";
import { ItemTypes } from "@/constants"; 

interface DraggablePieceProps {
  x: number;
  y: number;
  piece: string;
  movePiece: (fromX: number, fromY: number, toX: number, toY: number) => void;
}

const DraggablePiece: React.FC<DraggablePieceProps> = ({ x, y, piece, movePiece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { x, y },
    end: (item: { x: number; y: number } | undefined, monitor) => {
      const dropResult = monitor.getDropResult<{ x: number; y: number }>();
      if (item && dropResult) {
        movePiece(item.x, item.y, dropResult.x, dropResult.y);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={styles.draggablePiece} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {piece}
    </div>
  );
};

export default DraggablePiece;
