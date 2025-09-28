import { Button, Typography, Link } from "@mui/material";
import { Phone } from "@mui/icons-material";


const PhoneNumber = (props) => {
  return (
    <Button variant={props.variantButton ?? "contained"} color={props.color ?? "success"} startIcon={<Phone />}>
      <Typography variant={props.variantTypography ?? "body1"}>
        <Link
          href={`tel:${props.phoneNumber ?? ""}`}
          color={props.color ?? "primary"}
          underline="none"
          sx={{ textWrap: "nowrap" }}
        >
          {props.phoneNumber}
        </Link>
      </Typography>
    </Button>
  );
};

export default PhoneNumber;
