import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)"
  })
})

export const DraggableComponent = (id, index) => (props) => {
  return (
    <Draggable draggableId={id} index={index} >
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          {...props}
        >
          {props.children}
          </TableRow>
            )}
        </Draggable>
      )
      }

export const DroppableComponent = (onDragEnd) => (props) => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'1'} direction="vertical">
          {(provided) => {
            return (
              <TableBody ref={provided.innerRef} {...provided.droppableProps} {...props}>
                {props.children}
                {provided.placeholder}
              </TableBody>
            )
          }}
        </Droppable>
      </DragDropContext>
    )
  }