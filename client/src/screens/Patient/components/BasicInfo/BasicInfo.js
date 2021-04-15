import React, { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/EditOutlined";
import { KeyboardDatePicker } from "@material-ui/pickers";
import clsx from "clsx";
import moment from "moment";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import { CountryRegionData } from "react-country-region-selector";
import SwipeableViews from "react-swipeable-views";

import Alert from "../../../../components/Alert";
import CountrySelect from "../../../../components/common/CountrySelect";
import RegionSelect from "../../../../components/common/RegionSelect";
import { StyledTableRowLg, StyledTableCellLg } from "../../../../components/common/StyledTable";
import usePatientContext from "../../../../hooks/usePatientContext";
import { togglePatientInfoDialog } from "../../../../providers/Patient/actions";
import PatientService from "../../../../services/patient.service";
import {
  BasicInfoForm,
  InsuranceForm,
} from "../../../../static/patientBasicInfoForm";
import { calculateAge, paymentMethodType } from "../../../../utils/helpers";
import PaymentMethodsForm from "./components/PaymentMethodsForm";
import PharmaciesSearch from "./components/Pharmacies";

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(1),
  },
  root: {
    border: "1px solid",
    margin: theme.spacing(0, 0, 1, 0),
    borderRadius: 0,
  },
  inputTextRow: {
    marginBottom: theme.spacing(3),
  },
  select: {
    lineHeight: "2.30em",
  },
  table: {
    background: "white",
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
  tab: {
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: "unset",
    marginRight: theme.spacing(2),
    borderRadius: 0,
    borderBottom: `2px solid transparent`,
    "&:hover": {
      background: "transparent",
    },
  },
  tabSelected: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  alignCenter: {
    textAlign: "center",
  },
}));

const BasicInfo = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = usePatientContext();
  const currentDate = new Date();
  const formData = state.patientInfo.data;
  const paymentMethodsData = state.patientInfo.paymentMethods || [];
  const { patientId } = state;
  const { reloadData, reloadPaymentMethods } = props;
  const FirstRow = BasicInfoForm.firstRow;
  const SecondRow = BasicInfoForm.secondRow;
  const ThirdRow = BasicInfoForm.thirdRow;

  const [tabValue, setTabValue] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [basicInfo, setBasicInfo] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    status: "",
    provider: "",
    phone_home: "",
    phone_cell: "",
    phone_work: "",
    phone_other: "",
    phone_note: "",
    email: "",
    dob: "",
    otherPhone: "",
    phoneNotes: "",
    gender: "",
    ssn: "",
    password: "",
    postal: "",
    address: "",
    address2: "",
    city: "",
    // insurance fields
    insurance_name: "",
    insurance_group: "",
    insurance_member: "",
    insurance_phone: "",
    insurance_desc: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDeleteDialog = (item) => {
    setSelectedItem(item);
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const closeDeleteDialog = () => {
    setSelectedItem(null);
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  useEffect(() => {
    formData.status = formData.status ? formData.status : "active";
    setBasicInfo({ ...formData });
    // [Pakistan, PK, ["Azad Kashmir", "Punjab"]]
    // [United States, US, ["Alabama", "Illinois"]]
    const selectedCountry = CountryRegionData.filter((countryArray) => countryArray[1] === formData.country);
    if (selectedCountry.length) { // country and state is present in the db
      setCountry(selectedCountry[0]);

      const regions = selectedCountry[0][2].split("|").map((regionPair) => {
        const [regionName = null, regionInShort] = regionPair.split("~");
        return [regionName, regionInShort];
      });
      const selectedRegion = regions.filter((x) => x[1] === formData.state);
      if (selectedRegion.length) {
        setRegion(selectedRegion[0][1]);
      }
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setBasicInfo({
      ...basicInfo,
      [name]: value,
    });
  };

  const handleCountryRegion = (identifier, value) => {
    if (identifier === "country") {
      setCountry(value);
    } else if (identifier === "region") {
      setRegion(value);
    }
  };

  const onFormSubmit = () => {
    const reqBody = {
      data: {
        ...basicInfo,
        country: country[1],
        state: region,
      },
    };
    PatientService.updatePatient(patientId, reqBody)
      .then((response) => {
        enqueueSnackbar(`${response.message}`, { variant: "success" });
        reloadData();
        dispatch(togglePatientInfoDialog());
      });
  };

  const toggleNewPaymentMethodDialog = () => {
    setShowPaymentMethodForm((prevState) => !prevState);
    if (selectedPaymentMethod) {
      setTimeout(() => {
        setSelectedPaymentMethod(null);
      }, 500);
    }
  };

  const editPaymentMethodHandler = (item) => {
    setSelectedPaymentMethod(item);
    toggleNewPaymentMethodDialog();
  };

  const deletePaymentMethodHandler = (item) => {
    const paymentMethodId = item.id;
    PatientService.deletePaymentMethod(patientId, paymentMethodId)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        closeDeleteDialog();
        reloadPaymentMethods();
      });
  };

  const resetEmailHandler = () => {
    enqueueSnackbar(`Reset Email Sent`, { variant: "success" });
  };

  const handleChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (date) => {
    const name = "dob";
    setBasicInfo({
      ...basicInfo,
      [name]: date,
    });
  };

  const onPharmacySelect = (value) => {
    Object.keys(value).forEach((item) => {
      if (item === "pharmacy1") {
        basicInfo.pharmacy_id = value[item]?.id ? value[item].id : basicInfo.pharmacy_id;
      } else if (item === "pharmacy2") {
        basicInfo.pharmacy2_id = value[item]?.id ? value[item].id : basicInfo.pharmacy2_id;
      }
    });
    setBasicInfo({ ...basicInfo });
  };

  return (
    <>
      <PaymentMethodsForm
        isOpen={showPaymentMethodForm}
        onClose={toggleNewPaymentMethodDialog}
        reloadData={reloadPaymentMethods}
        cardData={selectedPaymentMethod}
      />
      <Alert
        open={showDeleteDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this payment method?"
        applyButtonText="Delete"
        cancelButtonText="Cancel"
        applyForm={() => deletePaymentMethodHandler(selectedItem)}
        cancelForm={closeDeleteDialog}
      />
      <Box mb={2}>
        <Grid container>
          <Button
            disableRipple
            className={clsx({
              [classes.tab]: true,
              [classes.tabSelected]: tabValue === 0,
            })}
            onClick={() => handleChange(0)}
          >
            Basics
          </Button>
          <Button
            disableRipple
            className={clsx({
              [classes.tab]: true,
              [classes.tabSelected]: tabValue === 1,
            })}
            onClick={() => handleChange(1)}
          >
            Insurance
          </Button>
          <Button
            disableRipple
            className={clsx({
              [classes.tab]: true,
              [classes.tabSelected]: tabValue === 2,
            })}
            onClick={() => handleChange(2)}
          >
            Pharmacy
          </Button>
          <Button
            disableRipple
            className={clsx({
              [classes.tab]: true,
              [classes.tabSelected]: tabValue === 3,
            })}
            onClick={() => handleChange(3)}
          >
            Payment Methods
          </Button>
        </Grid>
      </Box>

      <SwipeableViews
        index={tabValue}
        onChangeIndex={handleChange}
      >
        <Grid item xs={12}>
          <Grid container spacing={2} xs={12} className={classes.inputRow}>
            {FirstRow.map((item) => (
              <Grid key={item.name} item xs>
                {item.baseType === "input" ? (
                  <TextField
                    label={item.label}
                    name={item.name}
                    value={basicInfo[item.name]}
                    id={item.id}
                    type={item.type}
                    fullWidth
                    onChange={(e) => handleInputChange(e)}
                  />
                ) : (
                  <TextField
                    select
                    placeholder={item.label}
                    label={item.label}
                    id={item.id}
                    name={item.name}
                    value={basicInfo[item.name]}
                    fullWidth
                    onChange={(e) => handleInputChange(e)}
                  >
                    {item.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2} xs={12} className={classes.inputRow} alignItems="flex-end">
            {SecondRow.map((item) => (
              <Grid key={item.name} item xs>
                {item.baseType === "input" ? (
                  <TextField
                    label={item.label}
                    name={item.name}
                    value={
                      item.type === "date"
                        ? moment(basicInfo[item.name]).format("YYYY-MM-DD")
                        : basicInfo[item.name]
                    }
                    id={item.id}
                    type={item.type}
                    fullWidth
                    onChange={(e) => handleInputChange(e)}
                  />
                ) : (
                  <TextField
                    select
                    placeholder={item.label}
                    label={item.label}
                    id={item.id}
                    name={item.name}
                    value={basicInfo[item.name]}
                    fullWidth
                    onChange={(e) => handleInputChange(e)}
                  >
                    {item.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>
            ))}
            <Grid item xs>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item xs={8}>
                  <KeyboardDatePicker
                    required
                    id="date-picker-dialog"
                    label="Date of Birth"
                    format="dd/MM/yyyy"
                    value={basicInfo.dob}
                    onChange={handleDateChange}
                    maxDate={currentDate}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography gutterBottom>
                    {`Age: ${calculateAge(basicInfo.dob)}`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2} xs={12} className={classes.inputRow} alignItems="flex-end">
            {ThirdRow.map((item) => (
              <Grid key={item.name} item xs>
                {item.baseType === "input" ? (
                  <TextField
                    label={item.label}
                    name={item.name}
                    value={basicInfo[item.name]}
                    id={item.id}
                    type={item.type}
                    fullWidth
                    onChange={(e) => handleInputChange(e)}
                  />
                ) : (
                  <TextField
                    select
                    placeholder={item.label}
                    label={item.label}
                    id={item.id}
                    name={item.name}
                    value={basicInfo[item.name]}
                    fullWidth
                    onChange={(e) => handleInputChange(e)}
                  >
                    {item.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>
            ))}
            <Grid item xs>
              <Typography gutterBottom>
                {`Created: ${moment().format("MMM D, YYYY")}`}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={6} className={classes.inputRow}>
            <Grid container spacing={1}>
              <Grid item lg={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={basicInfo.address}
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  label="Address Line 2"
                  name="address2"
                  value={basicInfo.address2}
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  label="City"
                  name="city"
                  value={basicInfo.city}
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  type="number"
                  label="Zip/Postal"
                  name="postal"
                  value={basicInfo.postal}
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item lg={3}>
                <CountrySelect
                  id="country-select"
                  error={null}
                  name="country-select"
                  helperText=""
                  label="Country"
                  handleChange={(identifier, value) => handleCountryRegion(identifier, value)}
                  country={country}
                  margin="dense"
                />
              </Grid>
              <Grid item lg={3}>
                <RegionSelect
                  id="state-select"
                  error={null}
                  name="state-select"
                  helperText=""
                  label="State"
                  handleChange={(identifier, value) => handleCountryRegion(identifier, value)}
                  country={country}
                  region={region}
                  margin="dense"
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item md={4}>
                <TextField
                  label="Password"
                  name="password"
                  id="password"
                  type="password"
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item md={4} className={classes.alignCenter}>
                <Button
                  variant="outlined"
                  onClick={() => resetEmailHandler()}
                >
                  Send Reset Email
                </Button>
              </Grid>
              <Grid item md={4}>
                <Typography gutterBottom>
                  {`Last Login: ${moment().format("MMM D, YYYY")}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2} xs={12} className={classes.inputRow}>
          {InsuranceForm.map((item) => (
            <Grid key={item.name} item xs>
              <TextField
                label={item.label}
                name={item.name}
                id={item.id}
                type={item.type}
                value={basicInfo[item.name]}
                fullWidth
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={1}>
            <PharmaciesSearch
              pharmacy1Id={basicInfo.pharmacy_id || ""}
              pharmacy2Id={basicInfo.pharmacy2_id || ""}
              onChange={(val) => onPharmacySelect(val)}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => toggleNewPaymentMethodDialog()}
            >
              New
            </Button>
            <Table size="small" className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCellLg>Type</StyledTableCellLg>
                  <StyledTableCellLg align="center">Last Four</StyledTableCellLg>
                  <StyledTableCellLg align="center">Expires</StyledTableCellLg>
                  <StyledTableCellLg align="center">Actions</StyledTableCellLg>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentMethodsData.length
                  ? paymentMethodsData.map((item) => (
                    <StyledTableRowLg key={`${item.type}_${item.account_number}`}>
                      <StyledTableCellLg>{paymentMethodType(item.type)}</StyledTableCellLg>
                      <StyledTableCellLg align="center">{item.account_number}</StyledTableCellLg>
                      <StyledTableCellLg align="center">
                        {item.exp
                          && `${item.exp.toString().substring(0, 2)}/${item.exp.toString().substring(2, 4)}`}
                      </StyledTableCellLg>
                      <StyledTableCellLg align="center">
                        <IconButton onClick={() => editPaymentMethodHandler(item)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteDialog(item)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </StyledTableCellLg>
                    </StyledTableRowLg>
                  ))
                  : (
                    <StyledTableRowLg>
                      <TableCell colSpan={4}>
                        <Typography align="center" variant="body1">
                          No Records Found...
                        </Typography>
                      </TableCell>
                    </StyledTableRowLg>
                  )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </SwipeableViews>

      <Box mt={2}>
        <Grid container justify="space-between">
          <Button onClick={() => onFormSubmit()} variant="outlined">
            Save
          </Button>
          <Button onClick={() => dispatch(togglePatientInfoDialog())} variant="outlined">
            Cancel
          </Button>
        </Grid>
      </Box>
    </>
  );
};

BasicInfo.propTypes = {
  reloadData: PropTypes.func.isRequired,
  reloadPaymentMethods: PropTypes.func.isRequired,
};

export default BasicInfo;
