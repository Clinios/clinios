import React, { useState } from "react";

import {
  makeStyles, Typography, Grid, Box, TextField, useMediaQuery, useTheme,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import CountrySelect from "../../../../components/common/CountrySelect";
import RegionSelect from "../../../../components/common/RegionSelect";
// import useAuth from "../../../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(0.5),
  },
  mt2: {
    marginTop: theme.spacing(2),
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
}));

const AddressConfirmationForm = (props) => {
  const { onSubmit } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  // const { lastVisitedPatient, user } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"), {
    defaultMatches: true,
  });

  const [formFields, setFormFields] = useState({
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zipPostal: "",
  });

  const handleInputChnage = (e) => {
    const { value, name } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const handleCountryRegion = (identifier, value) => {
    if (identifier === "country") {
      setFormFields({
        ...formFields,
        [identifier]: value,
      });
    } else if (identifier === "region") {
      const key = "state";
      setFormFields({
        ...formFields,
        [key]: value,
      });
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    enqueueSnackbar("Address saved!");
    onSubmit();
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        color="textPrimary"
        className={classes.title}
        gutterBottom
      >
        Confirm Mailing Address
      </Typography>
      <Typography variant="h5" gutterBottom>
        Please confirm your mailing address for the kit that will be mailed to you.
      </Typography>

      <form onSubmit={onFormSubmit}>
        <Grid item md={4} sm={6} xs={12}>
          <TextField
            size="small"
            variant="outlined"
            className={classes.mt2}
            label="Address 1"
            name="address1"
            id="address1"
            type="text"
            fullWidth
            required
            onChange={(e) => handleInputChnage(e)}
          />
          <TextField
            size="small"
            variant="outlined"
            className={classes.mt2}
            label="Address 2"
            name="address2"
            id="address2"
            type="text"
            fullWidth
            required
            onChange={(e) => handleInputChnage(e)}
          />
        </Grid>
        <Grid container>
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              size="small"
              variant="outlined"
              className={classes.mt2}
              label="City"
              name="city"
              id="city"
              type="text"
              fullWidth
              required
              onChange={(e) => handleInputChnage(e)}
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Box ml={isDesktop ? 2 : 0} mt={2}>
              <TextField
                size="small"
                variant="outlined"
                label="Zip/Postal"
                name="zipPostal"
                id="zipPostal"
                type="text"
                fullWidth
                required
                onChange={(e) => handleInputChnage(e)}
              />
            </Box>
          </Grid>
          <Grid container>
            <Grid item md={4} sm={6} xs={12}>
              <Box mt={2}>
                <CountrySelect
                  size="small"
                  id="country-select"
                  error={null}
                  name="country-select"
                  helperText=""
                  label="Country"
                  outlined
                  handleChange={(identifier, value) => handleCountryRegion(identifier, value)}
                  country={formFields.country}
                  className={classes.mt2}
                />
              </Box>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Box ml={isDesktop ? 2 : 0} mt={2}>
                <RegionSelect
                  size="small"
                  id="state-select"
                  error={null}
                  name="state-select"
                  helperText=""
                  label="State"
                  outlined
                  handleChange={(identifier, value) => handleCountryRegion(identifier, value)}
                  country={formFields.country}
                  region={formFields.state}
                />
              </Box>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="outlined"
            className={classes.mt2}
          >
            Save
          </Button>
        </Grid>
      </form>
    </>
  );
};

AddressConfirmationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddressConfirmationForm;
