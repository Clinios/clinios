import React, { useState } from "react";

import {
  Box, Grid, Typography, Button, TextField, FormControlLabel, Checkbox,
  TableContainer, Table, TableRow, TableBody, TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { StyledTableRowSm, StyledTableCellSm } from "../../components/common/StyledTable";
import CatalogService from "../../services/catalog.service";
import { CatalogLabCompanies } from "../../static/catalog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "20px 0px",
  },
  borderSection: {
    position: "relative",
    border: "1px solid #aaa",
    borderRadius: "4px",
    padding: theme.spacing(1, 1.5),
    minHeight: 120,
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Catalog = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [searchText, setSearchText] = useState("");

  const searchTests = (e, text) => {
    e.preventDefault();
    setIsLoading(true);
    const reqBody = {
      data: {
        text,
      },
    };
    CatalogService.searchCatalog(reqBody).then((res) => {
      setCatalog(res.data);
      setIsLoading(false);
    })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h2"
        color="textPrimary"
      >
        Lab Test Catalog
      </Typography>
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <Grid className={classes.borderSection}>
              <Typography
                component="h4"
                variant="h4"
                color="textPrimary"
                className={classes.title}
                gutterBottom
              >
                Lab Company
              </Typography>
              {
                CatalogLabCompanies.map((item) => (
                  <Grid key={item.id}>
                    <FormControlLabel
                      value={item.id}
                      label={item.name}
                      control={<Checkbox color="primary" />}
                    />
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
          <Grid item md={8} xs={12}>
            <Box mb={2}>
              <form onSubmit={(e) => searchTests(e, searchText)}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item sm={9} xs={9}>
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
                      >
                        <StyledTableCellSm>{item.lab_name}</StyledTableCellSm>
                        <StyledTableCellSm>{item.proc_name}</StyledTableCellSm>
                        <StyledTableCellSm>
                          {item.lab_name === null || item.lab_name === "Quest"
                            ? `$${item.price}`
                            : (
                              <a className={classes.link} href="https://app.avonehr.com">
                                Login to see price
                              </a>
                            )}
                        </StyledTableCellSm>
                      </StyledTableRowSm>
                    ))
                    : (
                      <StyledTableRowSm>
                        <StyledTableCellSm colSpan={3}>
                          <Typography align="center" variant="body1">
                            {isLoading ? "Loading..." : "No Records Found..."}
                          </Typography>
                        </StyledTableCellSm>
                      </StyledTableRowSm>
                    )}
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
