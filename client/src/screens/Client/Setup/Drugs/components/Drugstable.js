import React, { useState } from "react";
import moment from "moment";
import {
  makeStyles,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import DrugsService from "../../../../../services/drugs.service";
import { setSuccess } from "../../../../../store/common/actions";
import { useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    minWidth: 450,
    marginTop: theme.spacing(2),
  },
  actions: {
    textAlign: "center",
    display: "flex",
    border: "none",
    "& button": {
      fontSize: "12px",
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.grey,
    fontSize: "12px",
    fontWeight: 700,
  },
  body: {
    fontSize: 14,
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
    },
    "& td": {
      fontSize: 12,
      height: "50px",
    },
  },
}))(TableRow);

const GreenSwitch = withStyles({
  switchBase: {
    color: grey[300],
    "&$checked": {
      color: green[500],
    },
    "&$checked + $track": {
      backgroundColor: green[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

const Drugstable = ({ user, result, fetchSearchDrugs }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let [state, setState] = useState(result);
  let [errors, setErrors] = useState([]);

  const changeHandler = (event, drugId) => {
    const payload = {
      drug_id: drugId,
    };
    let checked = event.target.checked;
    setState(
      result.map((item) => {
        if (drugId === item.id) {
          item.favorite = checked;
        }
        return state;
      })
    );
    if (checked === true) {
      DrugsService.addFavorite(drugId, user.id, payload).then(
        (response) => {
          setTimeout(() => {
            dispatch(setSuccess(`${response.data.message}`));
          }, 300);
        },
        (error) => {
          setTimeout(() => {
            setErrors(error.response.error);
          }, 300);
        }
      );
    } else {
      DrugsService.deleteFavorite(drugId).then(
        (response) => {
          setTimeout(() => {
            dispatch(setSuccess(`${response.data.message}`));
          }, 300);
        },
        (error) => {
          setTimeout(() => {
            setErrors(error.response.error);
          }, 300);
        }
      );
    }
  };

  return (
    <div>
      {errors &&
        errors.map((error, index) => (
          <Alert severity="error" key={index}>
            {error.msg}
          </Alert>
        ))}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Favorites</StyledTableCell>
              <StyledTableCell>Updated</StyledTableCell>
              <StyledTableCell>Updated By</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((drug) => (
              <StyledTableRow key={drug.id}>
                <TableCell component="th" scope="row">
                  {drug.name}
                </TableCell>
                <TableCell>
                  <GreenSwitch
                    size="small"
                    checked={Boolean(drug.favorite)}
                    name="switchBox"
                    onChange={(e) => {
                      changeHandler(e, drug.id);
                      setTimeout(() => {
                        fetchSearchDrugs();
                      }, 200);
                    }}
                  />
                </TableCell>
                <TableCell>
                  {drug.updated ? moment(drug.updated).format("lll") : ""}
                </TableCell>
                <TableCell>{drug.updated_name}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Drugstable;
