import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Button,
} from "@mui/material";
import SectionHeader from "./custom/SectionHeader";
import TextField from "./custom/TextField";
import TextFieldPhone from "./custom/TextFieldPhone";
import Select from "./custom/Select";
import { apiCall } from "../libs/Network";
import Loader from "./Loader";
import { AuthContext } from "../providers/AuthProvider";
//import { useSnackbar } from "../providers/SnackbarManager";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import {
  Api, DriveEta, Commute, EditNote, Apps, Power, Sync, Exposure, PhotoCamera,
  //PlaylistAddCheck, Payment, Business, LocationOn as LocationOnIcon
} from "@mui/icons-material";
import {
  isAdmin,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
} from "../libs/Validation";
import { i18n }  from "../i18n";
import config from "../config";


function EditProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(false);
  const [error, setError] = useState({});
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();
  const { productId } = useParams();
  console.log("productId:", productId);
  if (!productId) {
    showSnackbar(t("No product id specified", "error"));
    navigate(-1);
    return;
  }
  
  // const [allRoles, setAllRoles] = useState(false);
  // const [allPlans, setAllPlans] = useState(false);
    
  const [updateReady, setUpdateReady] = useState(false); // to handle form values changes refresh
  //const [sameProductProfile, setSameProductProfile] = useState(false); // to know if profile is the logged product's
  

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setImageUrl(e.target.files[0].name);
  };

  const handleImageUpload = async () => {
    showSnackbar("uploading...", "info");
    if (!selectedImage) {
      alert("Please select an image to upload");
      return;
    }

    // prepare form data to send the file
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data); // success message or file info
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  useEffect(() => { // get all products on mount
    (async() => {
      const result = await apiCall("post", "/product/getProduct", { productId }); // TODO: why get doesn't work ?
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        //showSnackbar("ok", "info");
        setProduct(result.product);
        console.log("PRODUCT:", result.product);
        // if (result.product._id === productId) {
        //   setSameProductProfile(true);
        // }
      }
    })();
  }, [productId]);
  // empty dependency array: this effect runs once when the component mounts
  
  // useEffect(() => {
  //   (async() => {
  //     const result = await apiCall("get", "/product/getAllRoles");
  //     if (result.err) {
  //       showSnackbar(result.message, "error");
  //     } else {
  //       setAllRoles(result.roles);
  //     }
  //   })();
  // }, [t]);
  
  // useEffect(() => {
  //   (async() => {
  //     const result = await apiCall("get", "/product/getAllPlans");
  //     if (result.err) {
  //       showSnackbar(result.message, "error");
  //     } else {
  //       setAllPlans(result.plans);
  //     }
  //   })();
  // }, [t]);

  useEffect(() => {
    if (updateReady) {
      setUpdateReady(false);
      formSubmit();
    }
  }, [updateReady]);

  const validateForm = () => {
    let response;

    // validate fields formally
    showSnackbar("validation...", "info");

    return true;
  };

  const setType = (value) => {
    setProduct({ ...product, type: value });
  };

  const setMdaCode = (value) => {
    setProduct({ ...product, mdaCode: value });
  };

  const setOemCode = (value) => {
    setProduct({ ...product, oemCode: value });
  };
  
  const setMake = (value) => {
    setProduct({ ...product, make: value });
  };

  const setModels = (value) => {
    setProduct({ ...product, models: value.split(", ") });
  };

  const setKw = (value) => {
    setProduct({ ...product, kw: value });
  };

  const setVolt = (value) => {
    setProduct({ ...product, volt: value });
  };

  const setAmpere = (value) => {
    setProduct({ ...product, ampere: value });
  };

  const setRotation = (value) => {
    setProduct({ ...product, rotation: value });
  };

  const setRegulator = (value) => {
    setProduct({ ...product, regulator: value });
  };

  const setNotes = (value) => {
    setProduct({ ...product, notes: value });
  };

  const setImageUrl = (value) => {
    setProduct({ ...product, imageUrl: value });
  };

  // const setModels = (value) => {
  //   console.log("setModels value:", value);
  //   setProduct({
  //     ...product,
  //     models: value.split(", ").map((model) => model.trim()),
  //   });
  // };

  // const setRoles = (values) => {
  //   const roles = allRoles.filter(role => values.includes(role.name));
  //   setProduct({ ...product, roles });
  // };

  // const setPlan = (value) => {
  //   const plan = allPlans.find(plan => value === plan.name);
  //   setProduct({ ...product, plan });
  // };

  const setAddress = (value) => {
    setProduct({ ...product, address: value });
  };

  const setFiscalCode = (value) => {
    setProduct({ ...product, fiscalCode: value });
  };
  
  const setBusinessName = (value) => {
    setProduct({ ...product, businessName: value });
  };

  // const setProfileImage = (value) => {
  //   setProduct({ ...product, profileImage: value });
  // };

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
        formData.append("file", selectedImage);
  
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
 
  // TODO: do something better, to check for data is present... <Loader /> does not show anything... :-/
  if (!product) {
    return <Loader loading={true} />;
  }
  
  return (
    <>
      <SectionHeader text={t("Products handling")}>
        {t("Edit product")}
      </SectionHeader>

      <Container maxWidth="xs">
        <form noValidate autoComplete="off">
          <TextField
            autoFocus
            id={"mdaCode"}
            value={product.mdaCode}
            onChange={(e) => setMdaCode(e.target.value)}
            placeholder={t("MDA code")}
            startIcon={<Api />}
            error={error.mdaCode}
          />

          <TextField
            id={"oemCode"}
            value={product.oemCode}
            onChange={(e) => setOemCode(e.target.value)}
            placeholder={t("OEM code")}
            startIcon={<Api />}
            error={error.oemCode}
          />

          <TextField
            id={"make"}
            value={product.make}
            onChange={(e) => setMake(e.target.value)}
            placeholder={t("Make")}
            startIcon={<DriveEta />}
            error={error.make}
          />

          <TextField
            id={"models"}
            value={product.models.join(", ")}
            onChange={(e) => setModels(e.target.value)}
            placeholder={t("Models")}
            startIcon={<Commute />}
            error={error.models}
          />

          <TextField
            id={"application"}
            value={product.application}
            onChange={(e) => setApplication(e.target.value)}
            placeholder={t("Application")}
            startIcon={<Apps />}
            error={error.application}
          />

          <TextField
            id={"kw"}
            value={product.kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder={t("kW")}
            startIcon={<Power />}
            error={error.kw}
          />

          <TextField
            id={"volt"}
            value={product.volt}
            onChange={(e) => setVolt(e.target.value)}
            placeholder={t("Volt")}
            startIcon={<Power />}
            error={error.volt}
          />

          <TextField
            id={"ampere"}
            value={product.ampere}
            onChange={(e) => setAmpere(e.target.value)}
            placeholder={t("Ampere")}
            startIcon={<Power />}
            error={error.ampere}
          />

          <TextField
            id={"rotation"}
            value={product.rotation}
            onChange={(e) => setRotation(e.target.value)}
            placeholder={t("Rotation")}
            startIcon={<Sync />}
            error={error.rotation}
          />

          <TextField
            id={"regulator"}
            value={product.regulator}
            onChange={(e) => setRegulator(e.target.value)}
            placeholder={t("Regulator")}
            startIcon={<Exposure />}
            error={error.regulator}
          />

          <TextField
            id={"notes"}
            value={product.notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("Notes")}
            startIcon={<EditNote />}
            multiline
            rows={2} 
            error={error.notes}
          />

          <TextField
            id={"image"}
            value={product.imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={t("Image")}
            startIcon={<PhotoCamera />}
            error={error.image}
            disabled={true}
            endIcon={
              <Button
                id={"imageUpload"}
                variant="contained"
                component="label"
                size="small"
                sx={{ mr: -1.4 }}
              >
                {t("Upload")}
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
      </Container>
    </>
  );
}

export default React.memo(EditProduct);
