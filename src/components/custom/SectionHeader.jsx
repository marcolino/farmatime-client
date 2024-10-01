import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const HeaderBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.nature.light,
  width: "100%",
  position: "relative",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: 4,
  paddingTop: theme.spacing(0), // Add padding for better spacing
  paddingBottom: theme.spacing(0),
  overflow: "visible", // Ensure the text can escape the bar
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  backgroundColor: "transparent",
  color: theme.palette.text,
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: "3rem !important",
  lineHeight: 1.2,
  position: "relative",
  top: "-23px", // negative top value to overlap
  paddingRight: theme.spacing(2),
  zIndex: 2, // ensure text is above the bar
  overflow: "visible", // ensure the text can escape the header
}));

const SectionHeader = ({
  ...props
}) => {
  return (
    <Paper elevation={0} sx={{ position: "relative", overflow: "visible" }}>
      <HeaderBar>
        <HeaderText>
          {props.children}
        </HeaderText>
      </HeaderBar>
    </Paper>
  );
};

export default SectionHeader;

// import React from "react";
// import { Paper, Box, Typography } from "@mui/material";
// import { styled } from "@mui/system";

// const HeaderBar = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.nature.light,
//   width: "100%",
//   position: "relative",
//   marginTop: theme.spacing(4),
//   marginBottom: theme.spacing(4),
//   borderRadius: 4,
// }));

// const HeaderText = styled(Typography)(({ theme }) => ({
//   textAlign: "right",
//   backgroundColor: "transparent",
//   color: theme.palette.nature.main,
//   paddingTop: theme.spacing(0),
//   paddingBottom: theme.spacing(1),
//   paddingRight: theme.spacing(1),
//   textTransform: "uppercase",
//   fontWeight: "bold",
//   fontSize: "2.0rem !important",
//   lineHeight: 1.2,
// }));

// const SectionHeader = ({
//   ...props
// }) => {
//   return (
//     <Paper elevation={0}>
//       <HeaderBar>
//         <HeaderText>
//           {...props.children}
//         </HeaderText>
//       </HeaderBar>
//     </Paper>
//   );
// };

// export default SectionHeader;