import React, { useState } from "react";
import { MuiTelInput } from "mui-tel-input";
//import unknownFlag from "../../assets/icons/NotFound.png";
import { i18n } from "../../i18n";
import config from "../../config";

const CustomTextFieldPhone = ({
  variant = "outlined",
  fullWidth = true,
  size = "small",
  margin = "dense",
  placeholder = "Search...",
  ...props
}) => {
  props.value = props.value ?? ""
  props.variant = props.variant ?? variant;
  props.fullWidth = props.fullWidth ?? fullWidth;
  props.size = props.size ?? size;
  props.margin = props.margin ?? margin;
  props.onChange = props.onChange ?? (() => { }); // without an onChange prop this component is unuseful

  // const [value, setValue] = useState("");

  // const handleChange = (newValue) => {
  //   setValue(newValue);
  // }

  return <MuiTelInput
    value={props.value}
    onChange={props.onChange}
    defaultCountry={config.i18n.country}
    placeholder={"phone number"}
    forceCallingCode={true}
    focusOnSelectCountry={true}
    //onlyCountries={["IT", "FR", "CH", "DE", "GB", "US"]}
    //preferredCountries={["IT", "FR", "CH", "DE", "GB", "US"]}
    preferredCountries={["IT"]}
    //disableFormatting // TODO: use this?
    langOfCountryName={i18n.language}
    {...props}
  />
  return (
    <TextField
      onChange={handleSearchChange}
      fullWidth={props.fullWidth} // TODO: from props
      {...props}
    />
  );
};

export default CustomTextFieldPhone;
