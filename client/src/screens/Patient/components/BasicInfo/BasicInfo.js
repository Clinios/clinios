import React, { useEffect, useState } from "react";

import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import CountrySelect from "../../../../components/common/CountrySelect";
import RegionSelect from "../../../../components/common/RegionSelect";
import {
  BasicInfoForm,
  InsuranceForm,
  Pharmacies,
  PaymentData,
} from "../../../../static/patientBasicInfoForm";
import { calculateAge } from "../../../../utils/helpers";

export default function BasicInfo(props) {
  const classes = useStyles();
  const { formData } = props;
  const FirstRow = BasicInfoForm.firstRow;
  const SecondRow = BasicInfoForm.secondRow;
  const ThirdRow = BasicInfoForm.thirdRow;

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

  });

  useEffect(() => {
    formData.status = formData.status ? formData.status : "active";
    setBasicInfo({ ...formData });
  }, [formData]);

  const handleInputChnage = (e) => {
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

  console.log("basic", basicInfo);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.root} variant="outlined">
            <Grid className={classes.sectionCard}>
              <Typography variant="h5" color="textPrimary" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={1} className={classes.inputRow}>
                {FirstRow.map((item, index) => (
                  <Grid key={index} item md={2}>
                    {item.baseType === "input" ? (
                      <TextField
                        label={item.label}
                        name={item.name}
                        value={basicInfo[item.name]}
                        id={item.id}
                        type={item.type}
                        fullWidth
                        onChange={(e) => handleInputChnage(e)}
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
                        onChange={(e) => handleInputChnage(e)}
                      >
                        {item.options.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                spacing={1}
                className={classes.inputRow}
                alignItems="flex-end"
              >
                {SecondRow.map((item, index) => (
                  <Grid key={index} item md={2}>
                    {item.baseType === "input" ? (
                      <TextField
                        label={item.label}
                        name={item.name}
                        value={item.type === "date" ? moment(basicInfo[item.name]).format("YYYY-MM-DD") : basicInfo[item.name]}
                        id={item.id}
                        type={item.type}
                        fullWidth
                        onChange={(e) => handleInputChnage(e)}
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
                        onChange={(e) => handleInputChnage(e)}
                      >
                        {item.options.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                ))}
                <Grid item md={2}>
                  <Typography>
&nbsp;&nbsp;Age:
                    {calculateAge(basicInfo.dob)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={1} className={classes.inputRow}>
                {ThirdRow.map((item, index) => (
                  <Grid key={index} item md={2}>
                    {item.baseType === "input" ? (
                      <TextField
                        label={item.label}
                        name={item.name}
                        value={basicInfo[item.name]}
                        id={item.id}
                        type={item.type}
                        fullWidth
                        onChange={(e) => handleInputChnage(e)}
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
                        onChange={(e) => handleInputChnage(e)}
                      >
                        {item.options.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item md={2}>
                  <Typography>
                    Last Login:
                    Jan 1, 2020
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <TextField
                    label="Password"
                    name="password"
                    id="password"
                    type="password"
                    fullWidth
                    onChange={(e) => handleInputChnage(e)}
                  />
                </Grid>
                <Grid item md={2}>
                  <Button variant="outlined">Send Reset Email</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={1} className={classes.inputRow}>
        <Grid item xs={6}>
          <Paper className={classes.root} variant="outlined">
            <Grid className={classes.halfSectionCard}>
              <Typography variant="h5" color="textPrimary">
                Home Address
              </Typography>
              <Grid container spacing={1}>
                <Grid item lg={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={basicInfo.address}
                    fullWidth
                    onChange={(e) => handleInputChnage(e)}
                  />
                </Grid>
                <Grid item lg={12}>
                  <TextField
                    label="Address Line 2"
                    name="address2"
                    value={basicInfo.address2}
                    fullWidth
                    onChange={(e) => handleInputChnage(e)}
                  />
                </Grid>
                <Grid item lg={3}>
                  <TextField
                    label="City"
                    name="city"
                    value={basicInfo.city}
                    fullWidth
                    onChange={(e) => handleInputChnage(e)}
                  />
                </Grid>
                <Grid item lg={3}>
                  <TextField
                    label="Zip/Postal"
                    name="zipPostal"
                    value={basicInfo.postal}
                    fullWidth
                    onChange={(e) => handleInputChnage(e)}
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
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.root} variant="outlined">
            <Grid className={classes.halfSectionCard}>
              <Typography variant="h5" color="textPrimary">
                Pharmacy
              </Typography>
              <Grid container spacing={1}>
                {Pharmacies.map((pharmacy, index) => (
                  <Grid key={index} item md={4}>
                    <TextField
                      label={pharmacy.name}
                      className={classes.inputTextRow}
                    />
                    <Typography>{pharmacy.name}</Typography>
                    <Typography>{pharmacy.address}</Typography>
                    <Typography>{pharmacy.phone}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.root} variant="outlined">
            <Grid className={classes.sectionCard}>
              <Typography variant="h5" color="textPrimary">
                Insurance
              </Typography>
              <Grid container spacing={1} className={classes.inputRow}>
                {InsuranceForm.map((item, index) => (
                  <Grid key={index} item md={2}>
                    <TextField
                      label={item.label}
                      name={item.name}
                      id={item.id}
                      type={item.type}
                      fullWidth
                      onChange={(e) => handleInputChnage(e)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.root} variant="outlined">
            <Grid className={classes.sectionCard}>
              <Typography variant="h5" color="textPrimary">
                Payment Methods &nbsp;&nbsp;
                <span>
                  <Button size="small" variant="outlined">
                    New
                  </Button>
                </span>
              </Typography>
              <Table
                size="small"
                className={classes.table}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="center">Last Four</TableCell>
                    <TableCell align="center">Expires</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PaymentData.map((row) => (
                    <TableRow key={row.type}>
                      <TableCell component="th" scope="row">
                        {row.type}
                      </TableCell>
                      <TableCell align="center">{row.lastFour}</TableCell>
                      <TableCell align="center">{row.expires}</TableCell>
                      <TableCell align="center">
                        <Button>Edit</Button>
                        <Button>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container justify="space-between">
        <Button variant="outlined">Save</Button>
        <Button variant="outlined">Cancel</Button>
      </Grid>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(1),
  },
  sectionCard: {
    padding: theme.spacing(1.5, 1),
  },
  halfSectionCard: {
    padding: theme.spacing(1.5, 1),
    minHeight: 198,
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
}));
