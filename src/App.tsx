import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";
import { AiFillPlusCircle } from "react-icons/ai";

const PlusIcon = AiFillPlusCircle as unknown as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const PlusBtn = styled(PlusIcon)`
  font-size: 48px;
  color: whitesmoke;

  &:hover {
    font-size: 56px;
    transition: font-size 0.2s linear;
  }
`;
const Wrapper = styled.div`
  display: flex;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  max-height: 300vh;
  gap: 30px;
`;

const Boards = styled.div`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(3, 1fr);
`;

const AddBtnWrapper = styled.div`
  display: inherit;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const AddBoardForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 24px;

  input {
    padding: 12px;
    border: 2px solid transparent;
    border-radius: 5px;
    margin-bottom: 12px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.bgColor};
    }
  }

  button {
    border: none;
    border-radius: 10px;
    padding: 8px;
    background-color: #74b9ff;
    font-size: 12px;
    cursor: pointer;
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  const handleAddBoard = () => {
    if (!newBoardName.trim()) return;
    const currentBoards = Object.keys(toDos);
    if (currentBoards.length > 8) {
      return;
    }
    setToDos((allBoards) => {
      return { ...allBoards, [newBoardName]: [] };
    });

    console.log(currentBoards.length);

    setIsAddingBoard(false);
    setNewBoardName("");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
        {isAddingBoard ? (
          <AddBoardForm
            onSubmit={(e) => {
              e.preventDefault();
              handleAddBoard();
            }}
          >
            <input
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="New board name"
              autoFocus
            />
            <button type="submit">Create</button>
          </AddBoardForm>
        ) : (
          <AddBtnWrapper onClick={() => setIsAddingBoard(true)}>
            <PlusBtn />
          </AddBtnWrapper>
        )}
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
