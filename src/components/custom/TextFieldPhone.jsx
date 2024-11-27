import React, { useState } from "react";
import { MuiTelInput } from "mui-tel-input";
//import unknownFlag from "../../assets/images/NotFound.png";
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
  const flagsBaseUrl = "/flags";
  props.value = props.value ?? "";
  props.variant = props.variant ?? variant;
  props.fullWidth = props.fullWidth ?? fullWidth;
  props.size = props.size ?? size;
  props.margin = props.margin ?? margin;
  props.onChange = props.onChange ?? (() => { }); // without an onChange prop this component is unuseful

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
    //disableFormatting
    langOfCountryName={i18n.language}
    getFlagElement={(isoCode, { imgProps, countryName, isSelected }) => {
      console.log("FLAGS", isoCode.toLowerCase(), countryName);
      const src = `${flagsBaseUrl}/${isoCode.toLowerCase()}.webp`;
      return <img src={src} width="32" />; // use flags locally (see scripts/download-language-flags.js) to avoid service-worker caching issues
    }}
    {...props}
  />
};

export default CustomTextFieldPhone;
