import React from "react";
import { Container, Typography, Card, CardContent, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
//import config from "../config";


const DataRemoval = () => {
  const { t } = useTranslation();

  return (
    <Container>
      {/* claims section */}
      <Card style={{ marginTop: 20, padding: 20 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t("Data Removal")}
          </Typography>
          <Typography variant="body1">
            {t("To completely remove your data press \"DATA REMOVAL\" button below. Operation cannot be undone.")}.
          </Typography>
          <Button variant="contained" color="error" onClick={() => {alert("TO BE DONE!")}}>
            {t("DATA REMOVAL")}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default React.memo(DataRemoval);
