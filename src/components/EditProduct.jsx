import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Box,
  Button,
} from "@mui/material";
import SectionHeader from "./custom/SectionHeader";
import TextField from "./custom/TextField";
import { apiCall } from "../libs/Network";
import Loader from "./Loader";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import {
  Api, DriveEta, Commute, EditNote, Apps, Power, Sync, Exposure, PhotoCamera, SettingsSuggest, AdsClick
} from "@mui/icons-material";
import PowerIconWithText from "./custom/PowerWithTextIcon";
import {
  isAdmin,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
} from "../libs/Validation";
//import { i18n }  from "../i18n";
import config from "../config";


function EditProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(false);
  const [productOriginal, setProductOriginal] = useState(false);
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

  const handleImageChange = (e) => {
    const imageFirstFile = e.target.files[0];
    setSelectedImage(imageFirstFile);
    if (imageFirstFile) {
      setSelectedImageObjectUrl(URL.createObjectURL(imageFirstFile));
    }
    setImageNameOriginal(imageFirstFile.name);
  };

  useEffect(() => { // get all products on mount
    (async() => {
      const result = await apiCall("post", "/product/getProduct", { productId });
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        setProduct(result.product);
        setProductOriginal(result.product);
        console.log("PRODUCT:", result.product);
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

    // validate fields formally
    showSnackbar("validation TO BE DONE...", "info");

    return true;
  };

  const setType = (value) => {
    setProduct({ ...product, type: value });
    setIsChanged({...isChanged, type: value != productOriginal.type })
  };

  const setMdaCode = (value) => {
    setProduct({ ...product, mdaCode: value });
    setIsChanged({...isChanged, mdaCode: value != productOriginal.mdaCode })
  };

  const setOemCode = (value) => {
    setProduct({ ...product, oemCode: value });
    setIsChanged({...isChanged, oemCode: value != productOriginal.oemCode })
  };
  
  const setMake = (value) => {
    setProduct({ ...product, make: value });
    setIsChanged({...isChanged, make: value != productOriginal.make })
  };

  const setModels = (value) => {
    setProduct({ ...product, models: value.split(", ") });
    setIsChanged({...isChanged, models: value != productOriginal.models })
  };

  const setApplication = (value) => {
    setProduct({ ...product, application: value });
    setIsChanged({...isChanged, application: value != productOriginal.application })
  };

  const setKw = (value) => {
    setProduct({ ...product, kw: value });
    setIsChanged({...isChanged, kw: value != productOriginal.kw })
  };

  const setVolt = (value) => {
    setProduct({ ...product, volt: value });
    setIsChanged({...isChanged, volt: value != productOriginal.volt })
  };

  const setAmpere = (value) => {
    setProduct({ ...product, ampere: value });
    setIsChanged({...isChanged, ampere: value != productOriginal.ampere })
  };

  const setRotation = (value) => {
    setProduct({ ...product, rotation: value });
    setIsChanged({...isChanged, rotation: value != productOriginal.rotation })
  };

  const setTeeth = (value) => {
    setProduct({ ...product, teeth: value });
    setIsChanged({...isChanged, teeth: value != productOriginal.teeth })
  };

  const setRegulator = (value) => {
    setProduct({ ...product, regulator: value });
    setIsChanged({...isChanged, regulator: value != productOriginal.regulator })
  };

  const setNotes = (value) => {
    setProduct({ ...product, notes: value });
    setIsChanged({...isChanged, notes: value != productOriginal.notes })
  };

  const setImageNameOriginal = (value) => {
    setProduct({ ...product, imageNameOriginal: value });
    setIsChanged({...isChanged, imageNameOriginal: value != productOriginal.imageNameOriginal })
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
      const productUpdateResult = await apiCall("post", "/product/updateProduct", { productId, ...product });
  
      if (productUpdateResult.err) {
        showSnackbar(productUpdateResult.message, "error");
        return;
      }
  
      // if an image is selected, call uploadProductImage to upload the image
      if (selectedImage) {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("image", selectedImage);
  
        const imageUploadResult = await apiCall("post", "/product/uploadProductImage", formData /*, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }*/);
  
        if (imageUploadResult.err) {
          showSnackbar(imageUploadResult.message, "error");
          return;
        }
      }
  
      // if both operations succeed, navigate back or show success message
      navigate(-1);
    } catch (error) {
      showSnackbar("An error occurred", "error");
      console.error(error);
    }
  };
  
  const formSubmit_WITHOUT_THE_IMAGE = (e) => {
    (async () => {
      const result = await apiCall("post", "/product/updateProduct", { productId, ...product });
      if (result.err) {
        showSnackbar(result.message, "error");
      } else {
        navigate(-1);
      }
    })();
  };

  const formCancel = (e) => {
    e.preventDefault();
    setError({});
    navigate(-1);
  }

  const styleForChangedFields = (fieldName) => {
    return {
      input: {
        fontWeight: isChanged[fieldName] ? "bold" : "normal",
      },
    };
  }
  const styleForChangedMultilineFields = (fieldName) => {
    return {
      fontWeight: isChanged[fieldName] ? "bold" : "normal",
    };
  }

  // TODO: do something better, to check for data is present... <Loader /> does not show anything... :-/
  if (!product) {
    return <Loader loading={true} />;
  }
  
  console.log("siteUrl:", config.siteUrl);
  //console.log("path:", "/assets/products/images/");
  console.log("path in config:", config.images.publicPath);
  console.log("product.imageNameOriginal:", product.imageNameOriginal);
  console.log("product.imageName:", product.imageName);

  return (
    <>
      <SectionHeader text={t("Products handling")}>
        {t("Edit product")}
      </SectionHeader>

      {/* <Container maxWidth="xs"> */}
      <Grid container spacing={2}>
        {/* for xs breakpoint, full width */}
        <Grid item xs={12} sm={4} md={3} lg={2}
         sx={{ 
          minWidth: { sm: "280px" },
          flexGrow: { sm: 1 },
          flexBasis: { sm: "auto" }
        }}>
          
          <form noValidate autoComplete="off">
            <TextField
              autoFocus
              id={"mdaCode"}
              label={t("MDA code")}
              value={product.mdaCode}
              onChange={(e) => setMdaCode(e.target.value)}
              placeholder={t("MDA code")}
              startIcon={<Api />}
              error={error.mdaCode}
              sx={styleForChangedFields("mdaCode")}
            />

            <TextField
              id={"oemCode"}
              label={t("OEM code")}
              value={product.oemCode}
              onChange={(e) => setOemCode(e.target.value)}
              placeholder={t("OEM code")}
              startIcon={<Api />}
              error={error.oemCode}
              sx={styleForChangedFields("oemCode")}
            />

            <TextField
              id={"type"}
              label={t("Type")}
              value={product.type}
              onChange={(e) => setType(e.target.value)}
              placeholder={t("Type")}
              startIcon={<AdsClick />}
              error={error.make}
              sx={styleForChangedFields("type")}
            />

            <TextField
              id={"make"}
              label={t("Make")}
              value={product.make}
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
              value={product.application}
              onChange={(e) => setApplication(e.target.value)}
              placeholder={t("Application")}
              startIcon={<Apps />}
              error={error.application}
              sx={styleForChangedFields("application")}
            />

            <TextField
              id={"kw"}
              label={t("kW")}
              value={product.kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder={t("kW")}
              startIcon={<PowerIconWithText text="kW" />}
              error={error.kw}
              sx={styleForChangedFields("kw")}
            />

            <TextField
              id={"volt"}
              label={t("Volt")}
              value={product.volt}
              onChange={(e) => setVolt(e.target.value)}
              placeholder={t("Volt")}
              startIcon={<PowerIconWithText text="V" />}
              error={error.volt}
              sx={styleForChangedFields("volt")}
            />

            <TextField
              id={"ampere"}
              label={t("Ampere")}
              value={product.ampere}
              onChange={(e) => setAmpere(e.target.value)}
              placeholder={t("Ampere")}
              startIcon={<PowerIconWithText text="A" />}
              error={error.ampere}
              sx={styleForChangedFields("ampere")}
            />

            <TextField
              id={"rotation"}
              label={t("Rotation")}
              value={product.rotation}
              onChange={(e) => setRotation(e.target.value)}
              placeholder={t("Rotation")}
              startIcon={<Sync />}
              error={error.rotation}
              sx={styleForChangedFields("rotation")}
            />

            <TextField
              id={"teeth"}
              label={t("Teeth")}
              value={product.teeth}
              onChange={(e) => setTeeth(e.target.value)}
              placeholder={t("Teeth")}
              startIcon={<SettingsSuggest />}
              error={error.teeth}
              sx={styleForChangedFields("teeth")}
            />

            <TextField
              id={"regulator"}
              label={t("Regulator")}
              value={product.regulator}
              onChange={(e) => setRegulator(e.target.value)}
              placeholder={t("Regulator")}
              startIcon={<Exposure />}
              error={error.regulator}
              sx={styleForChangedFields("regulator")}
            />

            <TextField
              id={"notes"}
              label={t("Notes")}
              value={product.notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Notes")}
              startIcon={<EditNote />}
              multiline
              rows={2}
              error={error.notes}
              InputProps={{ sx: styleForChangedMultilineFields("notes") }}
            />

            <TextField
              id={"image"}
              label={t("Image")}
              value={product.imageNameOriginal}
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
                  sx={{ mr: -1.2, mt: -0.8 }}
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2, // Adds spacing between the buttons
                mt: 2, // Optional: Add margin-top for spacing
              }}
            >
              <Button
                onClick={formCancel}
                fullWidth={false}
                variant="contained"
                color="secondary"
              >
                {t("Cancel")}
              </Button>
              <Button
                onClick={formSubmitBeforeUpdate}
                variant="contained"
                color="success"
              >
                {t("Confirm")}
              </Button>
            </Box>
          </form>
          
        </Grid>

        {/* for sm and up breakpoints, takes remaining space */}
        <Grid item xs={12} sm sx={{ flexGrow: 999 }}>
          <Box style={{ maxHeight: "50%", maxWidth: "50%", padding: 2 }}>
            <img
              width="600"
              height="300"
              src={`${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName}`}
              alt="product image"
              style={{pointerEvents: "none"}}
            />
          </Box>
          {selectedImageObjectUrl && (
            <Box style={{ maxHeight: "50%", maxWidth: "50%", padding: 2 }}>
              <img
                width="600"
                height="300"
                src={selectedImageObjectUrl}
                alt="new product image"
                style={{pointerEvents: "none"}}
              />
            </Box>
          )}
        </Grid>

      </Grid>
      {/* </Container> */}
    </>
  );
}

export default React.memo(EditProduct);
