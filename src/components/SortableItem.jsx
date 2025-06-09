import { useRef, useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton, Box, Typography, Chip, Tooltip, useTheme } from '@mui/material';
import { DragHandle as DragHandleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { t } from 'i18next';

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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  
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

  //console.log("data:", date);
  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1,
        p: 1,
        bgcolor: 'secondary.light',
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
      <Box
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexGrow: 1,
          minWidth: 0,
          gap: 1,
          fontSize: '0.875rem',
          overflow: 'hidden',
        }}
      >
        <Tooltip 
          title={name} 
          disableHoverListener={!isTruncated}
          placement="top"
        >
          <Typography
            variant="body2"
            ref={nameRef}
            noWrap 
            onClick={() => {
              onEditStart(id);
              onEdit(id, "name");
            }}
            sx={{
              flexShrink: 1,
              flexGrow: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </Typography>
        </Tooltip>
        
        <Box
          sx={{
            whiteSpace: 'nowrap',
            display: 'flex',
            ml: 'auto',
            gap: 1
          }}
        >
          <Chip
            label={(isSm ? "" : t("since") + " ") + formatDate(date)}
            onClick={() => {
              onEditStart(id);
              onEdit(id, "date");
            }}
            sx={{
              width: (isXs || isSm) ? 'auto' : 120,
              borderRadius: '4px',
              mr: isXs ? 0 : isSm ? 1 : 3,
              bgcolor: 'action.disabled',
              color: 'info.contrastText',
              '&:hover': { bgcolor: 'text.primary' }
            }}
          />

          <Chip
            label={(isSm ? "" : t("every") + " ") + t("{{count}} day", { count: frequency })}
            onClick={() => {
              onEditStart(id);
              onEdit(id, "frequency")
            }}
            sx={{
              width: (isXs || isSm) ? 'auto' : 130,
              borderRadius: '4px',
              mr: isXs ? 0 : isSm ? 1 : 3,
              bgcolor: 'action.disabled',
              color: 'info.contrastText',
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
        size="small"
        color="default"
        sx={{ 
          ml: isXs || isSm ? 0 : 1,
          '&:hover': { bgcolor: 'warning.light' }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
