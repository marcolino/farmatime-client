import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, ListItem, Typography, IconButton, Tooltip, Paper, styled } from 'mui-material-custom';
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
}));

export function SortableItem({
  id, name, frequency, date, formatDate, onEdit, onRemove, isEditing
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  //const { t } = useTranslation();
  const { t } = useTranslation();
  const { isMobile } = useMediaQueryContext();

  const isDragEnabled = (
    (isMobile && config.ui.jobs.medicines.dragAndDrop.mobile.enabled) ||
    (!isMobile && config.ui.jobs.medicines.dragAndDrop.desktop.enabled)
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto',
    opacity: isDragging ? 0.7 : 1,
    background: isDragging ? '#f0f0f0' : undefined,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      component={StyledSortableItem}
      disableGutters
    >
      {isDragEnabled && (
        <IconButton
          {...listeners}
          sx={{
            cursor: 'grab',
            mr: 1,
            touchAction: 'none', // Crucial for mobile drag-and-drop
            minWidth: isMobile ? 48 : undefined,
            minHeight: isMobile ? 48 : undefined,
            padding: isMobile ? '12px' : undefined,
          }}
          aria-label={t('Drag item')}
        >
          <DragIndicatorIcon fontSize={isMobile ? "large" : "medium"} />
        </IconButton>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('Every {{count}} days since {{date}}', { count: frequency, date: formatDate(date) })}
        </Typography>
      </Box>
      <Tooltip title={t("Edit item")} placement="top">
        <IconButton
          edge="end"
          aria-label={t('edit')}
          onClick={() => onEdit(id)}
          sx={{ 
            mx: 0,
            '&:hover': { bgcolor: 'success.light' }
          }}
          disabled={isEditing}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("Delete item")} placement="top">
        <IconButton
          edge="end"
          aria-label={t('delete')}
          onClick={() => onRemove(id)}
          sx={{
            mx: 0,
            //mx: isXs || isSm ? 0 : 0,
            '&:hover': { bgcolor: 'warning.light' }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}
