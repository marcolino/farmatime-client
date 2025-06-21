import { Box as _Box, Typography } from "@mui/material";

export function Box({ label, children, dangerouslySetInnerHTML, ...rest }) {
  const hasLabel = Boolean(label);

  if (!hasLabel) {
    // Just return standard MUI Box behavior
    return (
      <_Box {...rest}>
        {dangerouslySetInnerHTML ? (
          <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
        ) : (
          children
        )}
      </_Box>
    );
  }

  // Framed box with floating label
  return (
    <_Box
      sx={{
        position: "relative",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        px: 2,
        pt: 2.5, // space for floating label
        pb: 2,
        ...rest.sx,
      }}
      {...rest}
    >
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          top: 0,
          left: 8,
          transform: "translateY(-50%)",
          backgroundColor: "background.paper",
          px: 0.5,
          color: "text.secondary",
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>

      {dangerouslySetInnerHTML ? (
        <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
      ) : (
        children
      )}
    </_Box>
  );
}
