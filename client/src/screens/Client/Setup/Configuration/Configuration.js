import React from "react";
import { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Error from "./../../../../components/common/Error";
import Select from "@material-ui/core/Select";
import Logo from "../../../../assets/img/Logo.png";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import AuthService from "../../../../services/auth.service";
import ConfigurationService from "../../../../services/configuration.service";
import StateData from "./data/state";
import { useDispatch } from "react-redux";
import ConfigModal from "./modal";
import { setSuccess } from "./../../../../store/common/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "40px 0px",
  },
  uploadButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "450px",
    marginBottom: theme.spacing(2),
    "& h1": {
      [theme.breakpoints.up("md")]: {
        marginRight: theme.spacing(4),
      },
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
  },
  formElments: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "500px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    marginTop: "20px",
    maxWidth: "440px",
  },
  customSelect: {
    width: "200px",
  },
  type: {
    marginTop: "20px",
  },
  paper: {
    maxWidth: "456px",
  },
  textField: {
    width: "200px",
  },
  amount: {
    marginTop: "18px",
  },
  fileInput: {
    display: "none",
  },
}));

export default function Configuration(props) {
  const dispatch = useDispatch();
  const currentUser = AuthService.getCurrentUser() || {};
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);

  const [errors] = React.useState([]);
  const [modalHistory, setModalHistory] = useState({
    isOpen: false,
    data: [],
    currentUser: currentUser,
  });
  const logoRef = React.useRef(null);

  const initFormParams = {
    logo: Logo,
    clientId: "",
    clientCode: "",
    name: "",
    patientPortal: `app.clinios.com/signup?c=`,
    address: "",
    clientWebsite: "",
    addressLineTwo: "",
    email: "",
    city: "",
    ein: "",
    state: "",
    npi: "",
    zipcode: "",
    calendarStartTime: "12000",
    calendarEndTime: "22000",
    country: "",
    phone: "",
    fax: "",
  };

  const [formParams, setFormParams] = useState(initFormParams);

  const _fetchConfig = async () => {
    try {
      let { data = {} } = await ConfigurationService.getConfig({});
      data = data.data[0];
      setFormParams({
        logo: Logo,
        clientId: data.id,
        clientCode: data.code,
        name: data.name,
        patientPortal: `app.clinios.com/signup?c=${data.code}`,
        address: data.address,
        clientWebsite: data.website,
        addressLineTwo: data.address2,
        email: data.email,
        city: data.city,
        ein: data.ein,
        state: data.state,
        npi: data.npi,
        zipcode: data.postal,
        calendarStartTime: data.calendar_start_time,
        calendarEndTime: data.calendar_end_time,
        country: data.country,
        phone: data.phone,
        fax: data.fax,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const _fetchConfigHistory = async () => {
    try {
      const response = await ConfigurationService.getConfigHistory({});

      return response.data.data;
    } catch (e) {
      console.log(e);
    }
  };

  /**
   *
   */
  const _onSubmitConfig = async () => {
    setSubmitting(true);

    try {
      const _params = {
        address: formParams.address,
        address2: formParams.addressLineTwo,
        city: formParams.city,
        state: formParams.state,
        website: formParams.clientWebsite,
        country: formParams.country,
        calendar_start_time: formParams.calendarStartTime,
        calendar_end_time: formParams.calendarEndTime,
        email: formParams.email,
        ein: formParams.ein,
        npi: formParams.npi,
        postal: formParams.zipcode,
        phone: formParams.phone,
        fax: formParams.fax,
      };
      const response = await ConfigurationService.updateConfig(
        currentUser.id,
        _params
      );
      setSubmitting(false);
      dispatch(setSuccess(`${response.data.message}`));
    } catch (e) {
      setSubmitting(false);
    }
  };

  const _onSelectLogo = async (e) => {
    console.log(e);
    if (e.target.files) {
      setFormParams({
        ...formParams,
        logo: URL.createObjectURL(e.target.files[0]),
      });
      try {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        await ConfigurationService.updateLogo(currentUser.id, formData);
      } catch (e) {}
    }
  };

  const _onOpenModalHistory = async () => {
    let result = [];
    try {
      result = await _fetchConfigHistory();
    } catch (e) {
      console.log(e);
    }
    setModalHistory({
      ...modalHistory,
      isOpen: true,
      data: result,
    });
  };

  useEffect(() => {
    _fetchConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyPress = (e) => {
    if (e.which === 13) {
      _onSubmitConfig();
    }
  };

  const _onChangeInput = (e) => {
    setFormParams({
      ...formParams,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <div className={classes.uploadButtons} style={{ paddingRight: "12px" }}>
          <Typography component="h1" variant="h2" color="textPrimary">
            Configuration
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={() => _onOpenModalHistory()}
          >
            History
          </Button>
        </div>
      </div>
      <Typography
        className={classes.title}
        component="p"
        variant="body2"
        color="textPrimary"
      >
        This page is used to manage basic client information
      </Typography>
      <ConfigModal modal={modalHistory} setModal={setModalHistory} />
      <Error errors={errors} />
      <form className={classes.form} noValidate onSubmit={(e) => {}}>
        <Grid container spacing={2}>
          <Grid item sm={5}>
            <div className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                  <TextField
                    value={formParams.clientId}
                    variant="outlined"
                    onKeyPress={(e) => {
                      return onKeyPress(e);
                    }}
                    size="small"
                    disabled={true}
                    id="clientId"
                    label="Client Id"
                    name="clientId"
                    className={`${classes.textField} `}
                    autoComplete="clientId"
                    onChange={(e) => _onChangeInput(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    value={formParams.clientCode}
                    variant="outlined"
                    onKeyPress={(e) => {
                      return onKeyPress(e);
                    }}
                    size="small"
                    id="clientCode"
                    label="Client Code"
                    disabled={true}
                    className={`${classes.textField} `}
                    name="clientCode"
                    autoComplete="clientCode"
                    onChange={(e) => _onChangeInput(e)}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} style={{ marginLeft: "-80px" }}>
            <div>
              <input
                accept="image/*"
                className={classes.fileInput}
                id="contained-button-file"
                multiple
                onChange={_onSelectLogo}
                type="file"
                ref={logoRef}
              />

              <div>
                <small style={{ color: "#A0A0A0" }}>Logo</small>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt={`logo`}
                  style={{ maxWidth: "200px", maxHeight: "50px" }}
                  src={formParams.logo}
                />

                <label
                  className={`MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary`}
                  style={{ marginLeft: "20px" }}
                  htmlFor="contained-button-file"
                >
                  Browse
                </label>
              </div>
            </div>
          </Grid>
        </Grid>
        <div className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.name}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="name"
                disabled={true}
                label="Name"
                className={classes.textField}
                name="name"
                autoComplete="name"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.patientPortal}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="patientPortal"
                disabled={true}
                label="Patient Portal"
                className={`${classes.textField} `}
                name="patientPortal"
                autoComplete="patientPortal"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.address}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="address"
                label="Address"
                className={`${classes.textField} `}
                name="address"
                autoComplete="address"
                onChange={(e) => _onChangeInput(e)}
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.clientWebsite}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="clientWebsite"
                label="Client Website"
                className={`${classes.textField} `}
                name="clientWebsite"
                autoComplete="clientWebsite"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.addressLineTwo}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="addressLineTwo"
                label="addressLineTwo"
                className={`${classes.textField} `}
                name="addressLineTwo"
                autoComplete="addressLineTwo"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.email}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="email"
                label="Email"
                className={`${classes.textField} `}
                name="email"
                autoComplete="email"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.city}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="city"
                label="City"
                className={`${classes.textField} `}
                name="city"
                autoComplete="city"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.ein}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="ein"
                label="EIN"
                className={`${classes.textField} `}
                name="ein"
                autoComplete="ein"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                className={classes.customSelect}
                size="small"
              >
                <InputLabel htmlFor="age-native-simple">State</InputLabel>
                <Select
                  native
                  value={formParams.state}
                  onChange={(e) => _onChangeInput(e)}
                  inputProps={{
                    name: "state",
                    id: "age-native-simple",
                  }}
                  label="State"
                >
                  <option aria-label="None" value="" />
                  {StateData.map((v, i) => (
                    <option key={`state${i}`} value={v.code}>
                      {v.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.npi}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="npi"
                label="NPI"
                className={`${classes.textField} `}
                name="npi"
                autoComplete="npi"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.zipcode}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="zipcode"
                label="Zipcode"
                className={`${classes.textField} `}
                name="zipcode"
                autoComplete="zipcode"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                id="calendarStartTime"
                name={`calendarStartTime`}
                label="Calendar Start Time"
                value={formParams.calendarStartTime}
                className={classes.textField}
                onChange={(e) => _onChangeInput(e)}
                type="time"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                className={classes.customSelect}
                size="small"
              >
                <InputLabel htmlFor="age-native-simple">Country</InputLabel>
                <Select
                  native
                  value={formParams.country}
                  onChange={(e) => _onChangeInput(e)}
                  inputProps={{
                    name: "country",
                    id: "age-native-simple",
                  }}
                  label="Country"
                >
                  <option aria-label="None" value="US">
                    United States
                  </option>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                id="calendarEndTime"
                name={`calendarEndTime`}
                label="Calendar End Time"
                value={formParams.calendarEndTime}
                className={classes.textField}
                onChange={(e) => _onChangeInput(e)}
                type="time"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.phone}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="phone"
                label="Phone"
                className={`${classes.textField} `}
                name="phone"
                autoComplete="phone"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>

            <Grid xs="hidden" md={6} xl="hidden" />

            <Grid item xs={12} sm={6}>
              <TextField
                value={formParams.fax}
                variant="outlined"
                onKeyPress={(e) => {
                  return onKeyPress(e);
                }}
                size="small"
                id="fax"
                label="Fax"
                className={`${classes.textField} `}
                name="fax"
                autoComplete="fax"
                onChange={(e) => _onChangeInput(e)}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              size="small"
              type="button"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                if (!isSubmitting) {
                  _onSubmitConfig();
                }
              }}
            >
              {isSubmitting ? `Saving...` : `Save`}
            </Button>
          </Grid>
        </div>
      </form>
    </div>
  );
}
