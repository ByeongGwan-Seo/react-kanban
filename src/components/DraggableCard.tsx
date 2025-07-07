import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Card = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardBgColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 36px;
  width: 100%;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : "none"};
`;

const DeleteButton = styled.button`
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 4px 8px;

  span {
    font-size: 24px;
  }
  &:hover {
    color: tomato;
    transition: color 0.1s linear;
  }
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  handleDelete: () => void;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  handleDelete,
}: IDraggableCardProps) {
  const Icon = AiOutlineCloseCircle as unknown as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {toDoText}
          <DeleteButton
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <span>x</span>
          </DeleteButton>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
