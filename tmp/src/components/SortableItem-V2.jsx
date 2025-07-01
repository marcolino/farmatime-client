import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, ListItem, Typography, IconButton, Paper, styled } from 'mui-material-custom'; // Assuming these imports
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import config from '../config';

const StyledSortableItem = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  // Add this line for touch-action
  touchAction: 'none', // Crucial for mobile drag-and-drop
}));

export function SortableItem({ id, name, frequency, date, formatDate, onEdit, onRemove, isEditing }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Use isDragging for visual feedback
  } = useSortable({ id });
  const { t } = useTranslation();
  const { isMobile } = useMediaQueryContext();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto', // Bring dragged item to front
    opacity: isDragging ? 0.7 : 1, // Slightly fade dragged item
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      component={StyledSortableItem}
    >
      {(
        (isMobile && config.ui.jobs.dragAndDrop.mobile.enabled) ||
        (!isMobile && config.ui.jobs.dragAndDrop.desktop.enabled)
      ) && (
        <IconButton
          {...listeners} // Apply listeners to the drag handle
          sx={{ cursor: 'grab', mr: 1 }}
          aria-label={t('Drag item')}
        >
          <DragIndicatorIcon />
        </IconButton>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('Every {{frequency}} days since {{date}}', { frequency, date: formatDate(date) })}
        </Typography>
      </Box>
      <IconButton
        edge="end"
        aria-label={t('edit')}
        onClick={() => onEdit(name)}
        disabled={isEditing}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        edge="end"
        aria-label={t('delete')}
        onClick={() => onRemove(name)}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}
