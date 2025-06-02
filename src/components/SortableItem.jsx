import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton, Box, Typography, Chip, Tooltip } from '@mui/material';
import { DragHandle as DragHandleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
//import { bgcolor } from '@mui/system';

export const SortableItem = ({ id, name, frequency, date, formatDate, onRemove }) => {
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

  useEffect(() => {
    if (nameRef.current) {
      setIsTruncated(
        nameRef.current.scrollWidth > nameRef.current.clientWidth
      );
    }
  }, [name]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
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
          <Typography 
            ref={nameRef}
            noWrap 
            sx={{ 
              flexShrink: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pr: 1
            }}
          >
            {name}
          </Typography>
        </Tooltip>
        
        <Box sx={{ 
          display: 'flex',
          ml: 'auto',
          gap: 1
        }}>
          <Chip 
            label={`since ${formatDate(date)}`}
            size="small"
            sx={{
              width: 110,
              borderRadius: '4px',
              height: '24px',
              bgcolor: 'primary.light',
              color: 'primary.contrastText'
            }}
          />
          <Chip 
            label={`every ${frequency} day${frequency !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              width: 120,
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
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        onMouseDown={(e) => e.stopPropagation()}
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
