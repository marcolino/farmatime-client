import TableCell from '@mui/material/TableCell';

export function TableCellLastSticky({ children, ...props }) {
  return (
    <TableCell
      {...props}
      sx={{
        position: 'sticky',
        right: 0,
        backgroundColor: 'background.paper',
        zIndex: 3, // 3 is a safe value to stay above other headers
        ...props.sx,
      }}
    >
      {children}
    </TableCell>
  );
}

