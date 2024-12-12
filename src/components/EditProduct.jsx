import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { Grid, Box, FormControl, InputLabel } from "@mui/material";
import { Button } from "./custom";
import SectionHeader from "./custom/SectionHeader";
import ImageContainer from "./ImageContainer";
import { TextField, Select } from "./custom";
import { apiCall } from "../libs/Network";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import {
  Api, DriveEta, Commute, EditNote, Apps,
  Sync, Exposure, PhotoCamera, SettingsSuggest, TurnedIn
} from "@mui/icons-material";
import PowerIconWithText from "./custom/PowerWithTextIcon";
import {
  isAdmin,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
} from "../libs/Validation";
import config from "../config";


function EditProduct() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [product, setProduct] = useState(false);
  const [productOriginal, setProductOriginal] = useState(false);
  const [productAllTypes, setProductAllTypes] = useState([]);
  const [error, setError] = useState({});
  const { showSnackbar } = useSnackbarContext();
  const { t } = useTranslation();
  const { productId } = useParams();
  if (!productId) {
    showSnackbar(t("No product id specified", "error"));
    navigate(-1);
    return;
  }
    
  const [updateReady, setUpdateReady] = useState(false); // to handle form values changes refresh
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageObjectUrl, setSelectedImageObjectUrl] = useState(null);
  const [isChanged, setIsChanged] = useState({});

  
  useEffect(() => { // get product all constraints on mount
    (async () => {
      const result = await apiCall("post", "/product/getProductAllTypes");
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        //showSnackbar("ok", "info");
        setProductAllTypes(result.types);
      }
    })();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files.length > 1) { // this shouldn't happen, because <input type="file" /> has no "multiple" attribute
      showSnackbar(t("More than one image selected, using the first one"), "info");
    }

    const imageFirstFile = e.target.files[0];
    if (imageFirstFile) {
      // if (selectedImageObjectUrl) { // revoke the previous object URL if one exists
      //   URL.revokeObjectURL(selectedImageObjectUrl);
      // }
      // set the new image and its object URL
      setSelectedImage(imageFirstFile);
      setSelectedImageObjectUrl(URL.createObjectURL(imageFirstFile));
      setImageNameOriginal(imageFirstFile.name);
    }
  };

  useEffect(() => { // get product on mount
    (async () => {
      if (productId === "<new>") { // a new product
        console.log("NEW PRODUCT");
        const product = {
          mdaCode: "",
          oemCode: "",
          make: "",
          models: [],
          application: "",
          kw: "",
          volt: "",
          ampere: "",
          teeth: "",
          rotation: "",
          regulator: "",
          type: "",
          imageNameOriginal: "",
          imageName: "",
          notes: "",
        };
        setProduct(product);
      } else {
        const result = await apiCall("post", "/product/getProduct", { productId });
        if (result.err) {
          showSnackbar(result.message, result.status === 401 ? "warning" : "error");
        } else {
          setProduct(result.product);
          setProductOriginal(result.product);
        }
      }
    })();
  }, [productId]);
  
  useEffect(() => {
    if (updateReady) {
      setUpdateReady(false);
      formSubmit();
    }
  }, [updateReady]);

  const validateForm = () => {
    let response;

    // validate fields formally // TODO...

    return true;
  };

  const setType = (value) => {
    setProduct({ ...product, type: value });
    setIsChanged({ ...isChanged, type: value != productOriginal.type })
  };

  const setMdaCode = (value) => {
    setProduct({ ...product, mdaCode: value });
    setIsChanged({ ...isChanged, mdaCode: value != productOriginal.mdaCode })
  };

  const setOemCode = (value) => {
    setProduct({ ...product, oemCode: value });
    setIsChanged({ ...isChanged, oemCode: value != productOriginal.oemCode })
  };
  
  const setMake = (value) => {
    setProduct({ ...product, make: value });
    setIsChanged({ ...isChanged, make: value != productOriginal.make })
  };

  const setModels = (value) => {
    setProduct({ ...product, models: value.split(", ") });
    setIsChanged({ ...isChanged, models: value != productOriginal.models })
  };

  const setApplication = (value) => {
    setProduct({ ...product, application: value });
    setIsChanged({ ...isChanged, application: value != productOriginal.application })
  };

  const setKw = (value) => {
    setProduct({ ...product, kw: value });
    setIsChanged({ ...isChanged, kw: value != productOriginal.kw })
  };

  const setVolt = (value) => {
    setProduct({ ...product, volt: value });
    setIsChanged({ ...isChanged, volt: value != productOriginal.volt })
  };

  const setAmpere = (value) => {
    setProduct({ ...product, ampere: value });
    setIsChanged({ ...isChanged, ampere: value != productOriginal.ampere })
  };

  const setRotation = (value) => {
    setProduct({ ...product, rotation: value });
    setIsChanged({ ...isChanged, rotation: value != productOriginal.rotation })
  };

  const setTeeth = (value) => {
    setProduct({ ...product, teeth: value });
    setIsChanged({ ...isChanged, teeth: value != productOriginal.teeth })
  };

  const setRegulator = (value) => {
    setProduct({ ...product, regulator: value });
    setIsChanged({ ...isChanged, regulator: value != productOriginal.regulator })
  };

  const setNotes = (value) => {
    setProduct({ ...product, notes: value });
    setIsChanged({ ...isChanged, notes: value != productOriginal.notes })
  };

  const setImageNameOriginal = (value) => {
    setProduct({ ...product, imageNameOriginal: value });
    setIsChanged({ ...isChanged, imageNameOriginal: value != productOriginal.imageNameOriginal })
  };

  const formSubmitBeforeUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setUpdateReady(true); // set this flag and the updateProduct, since we can force some changes on product input fields
    setError({});
  }

  const formSubmit = async (/*e*/) => {
    //e.preventDefault();
    try {
      let id, result;
      if (productId === "<new>") { // insert new product
        result = await apiCall("post", "/product/insertProduct", { product });
        id = result.id;
      } else { // update existing product
        result = await apiCall("post", "/product/updateProduct", { productId, product });
        id = productId;
      }
      if (result.err) {
        return showSnackbar(result.message, "error");
      }
  
      // if an image is selected, call uploadProductImage to upload the image
      if (selectedImage) {
        const formData = new FormData();
        formData.append("productId", id);
        formData.append("image", selectedImage);
  
        result = await apiCall("post", "/product/uploadProductImage", formData);

        if (result.err) {
          if (result.message === "Input buffer contains unsupported image format") {
            result.message = t("Image format unsupported");
          }
          return showSnackbar(result.message, "error");
        }
      }
  
      // if both operations succeed, navigate back or show success message
      navigate(-1);
    } catch (error) {
      showSnackbar(`An error occurred updating the product: ${error.message}`, "error");
      console.error(error);
    }
  };

  const formCancel = (e) => {
    e.preventDefault();
    setError({});
    navigate(-1);
  }

  const styleForChangedFields = (fieldName) => {
    const sx = { fontWeight: isChanged[fieldName] ? "bold" : "normal", };
    return {
      ...sx, // for standard fields
      input: sx, // for multiline fields
    };
  }

  if (product && productAllTypes.length) {
    return (
      <>

        <SectionHeader text={t("Products handling")}>
          {t("Edit product")}
        </SectionHeader>
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            minHeight: "100vh",
          }}
        >
          <Grid container spacing={2} maxWidth={800}>
            {/* first column */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" flexDirection="column" gap={2}>
                <form noValidate autoComplete="off">

                  <TextField
                    autoFocus
                    id={"mdaCode"}
                    label={t("MDA code")}
                    value={product.mdaCode ?? ""}
                    onChange={(e) => setMdaCode(e.target.value)}
                    placeholder={t("MDA code")}
                    startIcon={<Api />}
                    error={error.mdaCode}
                    sx={styleForChangedFields("mdaCode")}
                  />

                  <TextField
                    id={"oemCode"}
                    label={t("OEM code")}
                    value={product.oemCode ?? ""}
                    onChange={(e) => setOemCode(e.target.value)}
                    placeholder={t("OEM code")}
                    startIcon={<Api />}
                    error={error.oemCode}
                    sx={styleForChangedFields("oemCode")}
                  />

                  <Select
                    id={"type"}
                    value={t(product.type ?? "")}
                    label={t("Type")}
                    options={productAllTypes}
                    //multiple={false}
                    onChange={(e) => setType(e.target.value)}
                    placeholder={t("Type")}
                    startIcon={<TurnedIn />}
                    error={error.types}
                    sx={styleForChangedFields("type")}
                  />

                  <TextField
                    id={"make"}
                    label={t("Make")}
                    value={product.make ?? ""}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder={t("Make")}
                    startIcon={<DriveEta />}
                    error={error.make}
                    sx={styleForChangedFields("make")}
                  />

                  <TextField
                    id={"models"}
                    label={t("Models")}
                    value={product.models.join(", ")}
                    onChange={(e) => setModels(e.target.value)}
                    placeholder={t("Models")}
                    startIcon={<Commute />}
                    error={error.models}
                    sx={styleForChangedFields("models")}
                  />

                  <TextField
                    id={"application"}
                    label={t("Application")}
                    value={product.application ?? ""}
                    onChange={(e) => setApplication(e.target.value)}
                    placeholder={t("Application")}
                    startIcon={<Apps />}
                    error={error.application}
                    sx={styleForChangedFields("application")}
                  />

                  <TextField
                    id={"kw"}
                    label={t("kW")}
                    value={product.kw ?? ""}
                    onChange={(e) => setKw(e.target.value)}
                    placeholder={t("kW")}
                    startIcon={<PowerIconWithText text="kW" />}
                    error={error.kw}
                    sx={styleForChangedFields("kw")}
                  />

                  <TextField
                    id={"volt"}
                    label={t("Volt")}
                    value={product.volt ?? ""}
                    onChange={(e) => setVolt(e.target.value)}
                    placeholder={t("Volt")}
                    startIcon={<PowerIconWithText text="V" />}
                    error={error.volt}
                    sx={styleForChangedFields("volt")}
                  />

                  <TextField
                    id={"ampere"}
                    label={t("Ampere")}
                    value={product.ampere ?? ""}
                    onChange={(e) => setAmpere(e.target.value)}
                    placeholder={t("Ampere")}
                    startIcon={<PowerIconWithText text="A" />}
                    error={error.ampere}
                    sx={styleForChangedFields("ampere")}
                  />

                  <TextField
                    id={"rotation"}
                    label={t("Rotation")}
                    value={product.rotation ?? ""}
                    onChange={(e) => setRotation(e.target.value)}
                    placeholder={t("Rotation")}
                    startIcon={<Sync />}
                    error={error.rotation}
                    sx={styleForChangedFields("rotation")}
                  />

                  <TextField
                    id={"teeth"}
                    label={t("Teeth")}
                    value={product.teeth ?? ""}
                    onChange={(e) => setTeeth(e.target.value)}
                    placeholder={t("Teeth")}
                    startIcon={<SettingsSuggest />}
                    error={error.teeth}
                    sx={styleForChangedFields("teeth")}
                  />

                  <TextField
                    id={"regulator"}
                    label={t("Regulator")}
                    value={product.regulator ?? ""}
                    onChange={(e) => setRegulator(e.target.value)}
                    placeholder={t("Regulator")}
                    startIcon={<Exposure />}
                    error={error.regulator}
                    sx={styleForChangedFields("regulator")}
                  />

                  <TextField
                    id={"notes"}
                    label={t("Notes")}
                    value={product.notes ?? ""}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("Notes")}
                    startIcon={<EditNote />}
                    multiline
                    rows={2}
                    error={error.notes}
                    sx={styleForChangedFields("notes")}
                    spellCheck={false}
                  />

                  <TextField
                    id={"image"}
                    label={t("Image")}
                    value={product.imageNameOriginal ?? ""}
                    onChange={(e) => setImageNameOriginal(e.target.value)}
                    placeholder={t("Image")}
                    startIcon={<PhotoCamera />}
                    error={error.image}
                    disabled={true}
                    sx={styleForChangedFields("imageNameOriginal")}
                    endIcon={
                      <Button
                        id={"imageUpload"}
                        variant="contained"
                        component="label"
                        size="small"
                        sx={{ position: "absolute", width: "auto", right: 4, mt: -0.8 }}
                      >
                        {t("Choose")}
                        <input
                          type="file"
                          hidden
                          onChange={handleImageChange}
                        />
                      </Button>
                    }
                  />
                </form>
              </Box>
            </Grid>

            {/* second column */}
            <Grid item xs={12} sm={6}>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ height: "100%" }}
              >

                
                <Box display="flex" flexDirection="column" gap={2} mt={1} alignItems="center" flexGrow={1}>

                  {/* current image */}
                  <ImageContainer
                    src={`${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName}`}
                    alt={t("Current image")}
                    borderColor="primary.main"
                    backgroundColor="background.default"
                    label={productOriginal.imageNameOriginal}
                  />

                  {/* selected image */}
                  {selectedImageObjectUrl && <ImageContainer
                    key={selectedImageObjectUrl} // force re-render when object URL changes
                    src={selectedImageObjectUrl}
                    alt={t("Image being uploaded")}
                    borderColor="primary.main"
                    backgroundColor="background.default"
                    label={selectedImage.name}
                  />}
                </Box>

                {/* buttons box */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2, // Adds spacing between the buttons
                    mt: 2,
                    mb: 0.5, // Optional: Add margin-top for spacing
                  }}
                >
                  <Button
                    onClick={formSubmitBeforeUpdate}
                    variant="contained"
                    color="success"
                    size="large"
                  >
                    {t("Confirm")}
                  </Button>
                  <Button
                    onClick={formCancel}
                    // fullWidth={false}
                    variant="contained"
                    color="secondary"
                    size="small"
                  >
                    {t("Cancel")}
                  </Button>
                </Box>

              </Box>
            </Grid>
          </Grid>
        </Box>

      </>
    );
  }
}

export default React.memo(EditProduct);
