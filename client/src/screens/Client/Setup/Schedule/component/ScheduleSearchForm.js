import React from "react";

import {
  Box, Button, Grid, makeStyles, TextField, MenuItem,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { TIMEZONES, CURRENT_TIMEZONE } from "../../../../../static/setup/schedules";

const useStyles = makeStyles(() => ({
  gridMargin: {
    marginTop: "15px",
  },
  submit: {
    paddingLeft: "30px",
    paddingRight: "30px",
    marginTop: "10px",
  },
}));

const ScheduleSearchForm = ({
  userList,
  userId,
  handleChangeOfUserId,
  fetchScheduleSearch,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={2} className={classes.gridMargin}>
      <TextField
        fullWidth
        autoFocus
        id="outlined-select-currency"
        select
        label="User"
        value={userId}
        onChange={handleChangeOfUserId}
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
        {userList.map((user) => (
          <option key={user.id} value={user.id}>
            {`${user.firstname} ${user.lastname}`}
          </option>
        ))}
      </TextField>

      <Box mt={1}>
        <TextField
          select
          variant="outlined"
          size="small"
          label="Timezone"
          id="timezone"
          name="timezone"
          fullWidth
          margin="dense"
          value={CURRENT_TIMEZONE}
        >
          {TIMEZONES.map((option) => (
            <MenuItem
              key={`${Math.random()}_${option.label}_${option.value}`}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Button
        size="medium"
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={fetchScheduleSearch}
      >
        Search
      </Button>
    </Grid>
  );
};

ScheduleSearchForm.propTypes = {
  userId: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf(
    PropTypes.arrayOf({
      id: PropTypes.string,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
    }),
  ).isRequired,
  handleChangeOfUserId: PropTypes.func.isRequired,
  fetchScheduleSearch: PropTypes.func.isRequired,
};

export default ScheduleSearchForm;
