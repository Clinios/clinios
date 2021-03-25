import React, { useState, useEffect, useCallback } from "react";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { orderBy } from "lodash";
import moment from "moment";

import usePatientContext from "../../../../hooks/usePatientContext";
import { calculateFunctionalRange, calculatePercentageFlag } from "../../../../utils/FunctionalRange";
import { calculateAge } from "../../../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(1),
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    border: "none",
    "& button": {
      fontSize: "12px",
    },
  },
  noRecordsMessage: {
    lineHeight: "21px",
    fontSize: 12,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.grey,
    fontSize: "12px",
    whiteSpace: "nowrap",
    fontWeight: 700,
    padding: "0px 6px 6px 2px",
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    fontSize: 14,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "& th": {
      fontSize: 12,
      whiteSpace: "nowrap",
      padding: "2px 16px 2px 2px",
    },
    "& td": {
      fontSize: 12,
      whiteSpace: "nowrap",
      padding: "2px 16px 2px 2px",
      "& svg": {
        fontSize: "1rem",
        position: "relative",
        zIndex: 1,
        top: 3,
        left: 3,
      },
    },
  },
}))(TableRow);

const InsightsContent = () => {
  const classes = useStyles();
  const { state } = usePatientContext();
  const { data } = state.tests;
  const { gender, dob } = state.patientInfo.data;
  const patientAge = Number(calculateAge(dob).split(" ")[0]);

  const [tests, setTests] = useState([]);

  const hasValue = (value) => !((typeof value === "undefined") || (value === null));

  const hasTestValue = (value, testsArray) => {
    const matchArray = testsArray.filter((x) => x.name === value);
    let res = null;
    if (matchArray.length) {
      const [firstEl] = matchArray;
      res = firstEl;
    }
    return res;
  };

  const addCalculatedTests = useCallback(() => {
    if (!!data && data.length) {
      let tempTestsArray = [...data];
      const sodiumTest = hasTestValue("Sodium", data);
      const potassiumTest = hasTestValue("Potassium", data);
      const glucoseTest = hasTestValue("Glucose", data);
      const ureaTest = hasTestValue("Blood Urea Nitrogen", data);
      if (!!sodiumTest && !!potassiumTest && !!glucoseTest && !!ureaTest) {
        const newTest = {
          count: 1,
          cpt_id: "Osmolarity",
          lab_dt: new Date(),
          name: "Osmolarity (Derived)",
          unit: "",
          value: ((1.9 * (sodiumTest.value + potassiumTest.value))
            + glucoseTest.value + (ureaTest.value * 0.5) + 5).toFixed(1),
        };
        tempTestsArray.push(newTest);
      }
      const hematocritTest = hasTestValue("Hematocrit", data);
      const proteinTotalTest = hasTestValue("Protein Total", data);
      if (!!hematocritTest && !!proteinTotalTest) {
        const newTest = {
          count: 1,
          cpt_id: "ViscosityHighShear",
          lab_dt: new Date(),
          name: "Viscosity High Shear (Derived)",
          unit: "",
          value: ((0.12 * hematocritTest.value) + (0.17 * ((proteinTotalTest.value * 10) - 2.07))).toFixed(1),
        };
        tempTestsArray.push(newTest);
      }
      const chlorideTest = hasTestValue("Chloride", data);
      const carbonDioxideTest = hasTestValue("Carbon Dioxide", data);
      if (!!sodiumTest && !!chlorideTest && !!carbonDioxideTest) {
        const newTest = {
          count: 1,
          cpt_id: "AnionGapNaClHCO3",
          lab_dt: new Date(),
          name: "Anion Gap (Na-Cl-HCO3) (Derived)",
          unit: "",
          value: (sodiumTest.value - (chlorideTest.value + carbonDioxideTest.value)).toFixed(1),
        };
        tempTestsArray.push(newTest);
      }
      tempTestsArray = orderBy(tempTestsArray, (item) => item.name.toLowerCase());
      setTests([...tempTestsArray]);
    } else {
      setTests([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, gender, patientAge]);

  useEffect(() => {
    addCalculatedTests();
  }, [addCalculatedTests]);

  const getFlag = (value, functionalRange) => {
    const flag = {};
    if (hasValue(functionalRange.low) && hasValue(functionalRange.high)) {
      flag.value = `${calculatePercentageFlag(functionalRange.low, functionalRange.high, value.value)
      }`;
    } else if (hasValue(value.range_low) && hasValue(value.range_high)) {
      flag.value = `${calculatePercentageFlag(value.range_low, value.range_high, value.value)}`;
    }
    if (flag.value) {
      if (flag.value.includes("Low")) {
        flag.icon = "low";
      } else if (flag.value.includes("High")) {
        flag.icon = "high";
      }
    }
    return flag;
  };

  const getRange = (value, functionalRange) => {
    const range = {};
    if (hasValue(functionalRange.low) && hasValue(functionalRange.high)) {
      range.value = `${functionalRange.low} - ${functionalRange.high}`;
    } else if (hasValue(value.range_low) && hasValue(value.range_high)) {
      range.value = `${value.range_low} - ${value.range_high}`;
    }
    return range;
  };

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Test</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
              <StyledTableCell>Range</StyledTableCell>
              <StyledTableCell>Flag</StyledTableCell>
              <StyledTableCell>Iron Deficiency</StyledTableCell>
              <StyledTableCell>Blood Loss</StyledTableCell>
              <StyledTableCell>Inflammation</StyledTableCell>
              <StyledTableCell>Hemolytic</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!tests && tests.length
              ? tests.map((row) => {
                const functionalRange = calculateFunctionalRange(row.cpt_id, gender, patientAge);
                const flag = getFlag(row, functionalRange);
                const range = getRange(row, functionalRange);
                return (
                  <StyledTableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row.lab_dt ? moment(row.lab_dt).format("MMM D YYYY") : ""}
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>{range.value}</TableCell>
                    <TableCell>
                      {flag.value}
                      {flag.icon === "low" && (
                        <ArrowDownwardIcon />
                      )}
                      {flag.icon === "high" && (
                        <ArrowUpwardIcon />
                      )}
                    </TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.count}</TableCell>
                  </StyledTableRow>
                );
              })
              : (
                <StyledTableRow>
                  <TableCell colSpan={10}>
                    <Typography className={classes.noRecordsMessage} align="center" variant="body1">
                      No Records Found...
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

InsightsContent.propTypes = {
};

export default InsightsContent;
