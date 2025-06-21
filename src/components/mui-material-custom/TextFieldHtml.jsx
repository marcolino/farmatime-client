import { FormControl, InputLabel, Box } from '@mui/material';

export function TextFieldHtml({ label, html, minHeight = 120, disabled, sx }) {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      disabled={disabled}
      sx={{
        position: 'relative',
        borderRadius: 1,
        border: '1.5px solid',
        borderColor: 'grey.400',
        pt: 0,
        px: 2,
        pb: 1,
        bgcolor: 'background.paper',

        ...sx,
      }}
    >
      <InputLabel
        shrink
        sx={{
          position: 'absolute',
          top: 2,
          left: 12,
          bgcolor: 'background.paper',
          px: 0.5,
          fontSize: 13,
          color: 'text.secondary',
          userSelect: 'none',
          pointerEvents: 'none',
          transform: 'translate(0, -50%) scale(0.75)',
          transformOrigin: 'left top',
          zIndex: 1,
        }}
      >
        {label}
      </InputLabel>

      <Box
        disabled={true}
        sx={{
          minHeight,
          pt: 0,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          userSelect: disabled ? 'none' : 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </FormControl>
  );
}


