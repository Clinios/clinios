import React, { useEffect, useState } from "react";

import {
  Box, Grid, Typography, Button, TextField, TableContainer, Table, TableRow, TableBody, TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { StyledTableRowSm, StyledTableCellSm } from "../../components/common/StyledTable";
// import EmailService from "../../services/email.service";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "30px 0px",
  },
  borderSection: {
    position: "relative",
    border: "1px solid #aaa",
    borderRadius: "4px",
    padding: theme.spacing(0.5, 1.5),
    minHeight: 120,
  },
}));

const Catalog = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  // const [catalog, setCatalog] = useState([]);
  const catalog = [];
  const [searchText, setSearchText] = useState("");

  useEffect(() => {

  }, []);

  const searchTests = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // const reqBody = {
    //   data: {
    //     text,
    //     company_id: selectedCompany.length ? selectedCompany : undefined,
    //   },
    // };
    // PatientService.searchTests(patientId, reqBody).then((res) => {
    //   setCatalog(res.data);
    // });
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h2"
        color="textPrimary"
        className={classes.title}
      >
        Lab Test Catalog
      </Typography>
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item md={4}>
            <Grid className={classes.borderSection}>
              <Typography
                component="h4"
                variant="h5"
                color="textPrimary"
                className={classes.title}
              >
                Lab Company
              </Typography>
            </Grid>
          </Grid>
          <Grid item md={8}>
            <Box mb={2}>
              <form onSubmit={(e) => searchTests(e, searchText)}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item sm={9} xs={8}>
                    <TextField
                      autoFocus
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      type="submit"
                      fullWidth
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
            {/* Table starts here  */}
            <TableContainer className={classes.tableContainer}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCellSm>Lab Company</StyledTableCellSm>
                    <StyledTableCellSm>Test Name</StyledTableCellSm>
                    <StyledTableCellSm>Price</StyledTableCellSm>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(!isLoading && catalog.length)
                    ? catalog.map((item) => (
                      <StyledTableRowSm
                        key={item.marker_id}
                        className={classes.pointer}
                      // onClick={() => onFormSubmit(item)}
                      >
                        <StyledTableCellSm>{item.price ? `$${item.price}` : ""}</StyledTableCellSm>
                        <StyledTableCellSm>{item.favorite ? "Yes" : ""}</StyledTableCellSm>
                        <StyledTableCellSm>{item.favorite ? "Yes" : ""}</StyledTableCellSm>
                      </StyledTableRowSm>
                    ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

Catalog.propTypes = {
};

export default Catalog;
