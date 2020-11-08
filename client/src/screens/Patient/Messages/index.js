import React, { useState } from "react";

import {
  TextField, Button, Grid, Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const Medications = (props) => {
  const classes = useStyles();
  const { onClose } = props;
  const [searchText, setSearchText] = useState("");

  const handleInputChnage = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  return (
    <>
      <Grid className={classes.heading} container justify="space-between">
        <Typography variant="h3" color="textSecondary">
          Select Drug
        </Typography>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <TextField
            label=""
            placeholder="Search..."
            name="search"
            fullWidth
            variant="outlined"
            value={searchText}
            onChange={(e) => handleInputChnage(e)}
            className={classes.inputHeading}
            size="small"
          />
          {[...Array(5)].map((item, index) => (
            <Grid key={index}>
              <Typography gutterBottom variant="body1">
                Exythromycine 25mcg Tablets
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid item md={4}>
          <Grid className={classes.header}>
            <Typography variant="h4" color="textSecondary" align="center">
              Recent
            </Typography>
          </Grid>
          {[...Array(5)].map((item, index) => (
            <Grid key={index}>
              <Typography gutterBottom variant="body1" align="center">
                Exythromycine 25mcg Tablets
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid item md={4}>
          <Grid className={classes.header}>
            <Typography variant="h4" color="textSecondary" align="center">
              Recommended
            </Typography>
          </Grid>
          {[...Array(5)].map((item, index) => (
            <Grid key={index}>
              <Typography gutterBottom variant="body1" align="center">
                Exythromycine 25mcg Tablets
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  heading: {
    marginBottom: theme.spacing(4),
  },
  inputHeading: {
    marginBottom: theme.spacing(1),
  },
  header: {
    minHeight: 38,
    marginBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default Medications;
