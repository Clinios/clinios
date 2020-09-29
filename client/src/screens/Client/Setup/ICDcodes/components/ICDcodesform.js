import {
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  controlLabel: {
    marginLeft: "0px",
    marginRight: "0px",
  },
  textField: {
    marginLeft: "30px",
    width: "250px",
  },
  submit: {
    padding: "4px 30px",
    fontSize: "1rem",
  },
}));

const ICDcodesform = ({
  fetchSearchIcdCodes,
  textChangeHandler,
  checkBoxChangeHandler,
}) => {
  const classes = useStyles();
  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      fetchSearchIcdCodes();
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <FormControlLabel
        control={
          <TextField
            autoFocus={true}
            onChange={textChangeHandler}
            className={classes.textField}
            name="searchTerm"
            onKeyUp={(event) => handleKeyUp(event)}
          />
        }
        label="Name"
        labelPlacement="start"
        className={classes.controlLabel}
      />
      <br />
      <FormControlLabel
        value="favorites"
        control={
          <Checkbox
            name="favorite"
            onChange={checkBoxChangeHandler}
            color="primary"
            onKeyUp={(event) => handleKeyUp(event)}
          />
        }
        label="Favorites"
        labelPlacement="start"
        className={classes.controlLabel}
      />
      <br />
      <Button
        size="small"
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={fetchSearchIcdCodes}
      >
        Search
      </Button>
    </div>
  );
};

export default ICDcodesform;
