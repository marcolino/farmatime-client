import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton, Box, /*Typography,*/ TextField, Chip, Tooltip } from '@mui/material';
import { DragHandle as DragHandleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
// import { border } from '@mui/system';
// import { is } from 'date-fns/locale';
//import { bgcolor } from '@mui/system';

export const SortableItem = ({
  id,
  name,
  frequency,
  date,
  formatDate,
  onEdit,
  onRemove,
  isEditing,
  onEditStart,
  //onEditEnd
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const nameRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  //const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (nameRef.current) {
      setIsTruncated(
        nameRef.current.scrollWidth > nameRef.current.clientWidth
      );
    }
  }, [name]);

  const transformStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    //opacity: isDragging ? 0.3 : 0.6,
    // opacity: opacity,
    // border: isUpdating ? 1 : 0,
    // borderColor: isUpdating ? 'grey.500' : 'transparent',
    // borderWidth: isUpdating ? 1 : 0,
    // borderStyle: isUpdating ? 'dashed' : 'solid',
    // borderRadius: 1,
  };
  const opacityStyle = {
    opacity: isDragging ? 0.3 : isEditing ? 0.6 : 1
  };
  const borderStyle = {
    border: isEditing ? 1 : 0,
    borderColor: isEditing ? 'grey.500' : 'transparent',
    borderWidth: isEditing ? 1 : 0,
    borderStyle: isEditing ? 'dotted' : 'solid',
    borderRadius: 1,
  };
  const style = {
    ...transformStyle,
    ...opacityStyle,
    ...borderStyle, 
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{
        display: 'flex',
        alignItems: 'center',
        //mr: -1,
        mb: 0.8,
        p: 0.5,
        bgcolor: 'grey.300',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      {/* Drag handle */}
      <IconButton
        {...listeners}
        size="small"
        sx={{ 
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
          mr: 1
        }}
      >
        <DragHandleIcon />
      </IconButton>

      {/* Combined name and info */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        flexGrow: 1,
        minWidth: 0,
      }}>
        <Tooltip 
          title={name} 
          disableHoverListener={!isTruncated}
          placement="top"
        >
          <TextField
            variant="standard"
            readOnly={true}
            ref={nameRef}
            //noWrap 
            onClick={() => {
              //setIsUpdating(true);
              onEditStart(id);
              onEdit(id, "name")
            }}
            sx={{ 
              flexShrink: 1,
              minWidth: 0,
              //overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: 0,
              pr: 1,
              cursor: 'grab'
            }}
            input={{ readOnly: true }}
            InputProps={{ disableUnderline: true }}
            value={name}
          />
            {/* {name} ...
          </TextField> */}
        </Tooltip>
        
        <Box sx={{ 
          display: 'flex',
          ml: 'auto',
          gap: 1
        }}>
          <Chip 
            label={`since ${formatDate(date)}`}
            //size="small"
            onClick={() => {
              //setIsUpdating(true);
              onEditStart(id);
              onEdit(id, "date");
            }}
            sx={{
              width: 120,
              borderRadius: '4px',
              height: '24px',
              bgcolor: 'primary.light',
              color: 'primary.contrastText'
            }}
          />
          <Chip 
            label={`every ${frequency} day${frequency !== 1 ? 's' : ''}`}
            //size="small"
            onClick={() => {
              //setIsUpdating(true);
              onEditStart(id);
              onEdit(id, "frequency")
            }}
            sx={{
              width: 130,
              borderRadius: '4px',
              height: '24px',
              //fontSize: '0.75rem',
              bgcolor: 'primary.light',
              color: 'primary.contrastText'
            }}
          />
        </Box>
      </Box>

      {/* Delete button */}
      <IconButton
        //onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        size="small"
        color="default"
        sx={{ 
          ml: 1,
          '&:hover': { bgcolor: 'warning.light' }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
