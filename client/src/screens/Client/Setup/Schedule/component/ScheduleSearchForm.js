import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  gridMargin: {
    marginTop: "15px",
  },
  submit: {
    paddingLeft: "30px",
    paddingRight: "30px",
    marginTop: "10px",
  },
}));

const ScheduleSearchForm = () => {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={2} className={classes.gridMargin}>
      <TextField
        fullWidth={true}
        id="outlined-select-currency"
        select
        label="User"
        // value={labCompanyId}
        // onChange={handleChangeOfLabCompanyId}
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true,
        }}
        SelectProps={{
          native: true,
        }}
      >
        <option aria-label="None" value="" />
        {/* {lebCompanyList.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))} */}
      </TextField>
      <Button
        size="medium"
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        // onClick={fetchCptCodeSearch}
      >
        Search
      </Button>
    </Grid>
  );
};

export default ScheduleSearchForm;
