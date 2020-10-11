import {
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { useState } from "react";
import moment from "moment";
import CptGroupMembersModal from "./modal/CptGroupMembersModal";
import EditCptCodeModal from "./modal/EditCptCodeModal";
import CPTCodesService from "../../../../../services/cpt.service";
import { setSuccess } from "../../../../../store/common/actions";
import { useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import NumberFormat from "react-number-format";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    minWidth: 450,
    marginTop: theme.spacing(2),
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
      padding: "6px 16px",
      fontSize: 12,
      height: "50px",
    },
  },
}))(TableRow);

const CPTtable = ({ searchResult, user, fetchCptCodeSearch }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [groupIsOpen, setGroupIsOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const [cpt_id, set_cpt_id] = useState("");
  const [cpt_description, set_cpt_description] = useState("");
  const [cpt_favorite, set_cpt_favorite] = useState("");
  const [cpt_fee, set_cpt_fee] = useState("");
  const [cpt_billable, set_cpt_billable] = useState("");
  const [cpt_notes, set_cpt_notes] = useState("");

  const payload = {
    cptId: cpt_id,
    favorite: cpt_favorite,
    billable: cpt_billable,
    fee: cpt_fee,
    notes: cpt_notes,
  };

  const handleIsOpen = (id, desc, fee, fav, bill) => {
    set_cpt_id(id);
    set_cpt_description(desc);
    set_cpt_fee(fee);
    set_cpt_favorite(fav);
    set_cpt_billable(bill);
    setIsOpen(true);
  };
  const hendleOnClose = () => {
    setIsOpen(false);
  };

  const hendleGroupOnClose = () => {
    setGroupIsOpen(false);
  };

  const handleGroupIsOpen = (group) => {
    let getListOfGroup = String(group).split(";");
    let data = [];
    getListOfGroup.map((g) => {
      searchResult.filter((c) => {
        if (String(c.cpt) === g.trim()) {
          let list = {
            id: c.id,
            description: c.cpt,
            lab: c.lab_company,
          };
          data.push(list);
        }
        return c;
      });
      return g;
    });
    setGroups(data);
    setGroupIsOpen(true);
  };

  const handleChangeFee = (e) => {
    set_cpt_fee(e.target.value);
  };
  const handleChangeFavorite = (e) => {
    set_cpt_favorite(e.target.checked);
  };
  const handleChangeBillable = (e) => {
    set_cpt_billable(e.target.checked);
  };

  const handleChangeNotes = (e) => {
    set_cpt_notes(e.target.value);
  };

  const handleEditCptCode = () => {
    CPTCodesService.updateClientCpt(cpt_id, user.id, payload).then(
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
    setIsOpen(false);
    setTimeout(() => {
      fetchCptCodeSearch();
    }, 200);
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
              <StyledTableCell>CPT ID</StyledTableCell>
              <StyledTableCell>CPT Description</StyledTableCell>
              <StyledTableCell>Lab Company</StyledTableCell>
              <StyledTableCell>Favorite</StyledTableCell>
              <StyledTableCell>Billable</StyledTableCell>
              <StyledTableCell>Fee</StyledTableCell>
              <StyledTableCell>Client</StyledTableCell>
              <StyledTableCell>Group</StyledTableCell>
              <StyledTableCell>Updated</StyledTableCell>
              <StyledTableCell>Updated By</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResult.map((result) => (
              <StyledTableRow key={result.id}>
                <TableCell component="th" scope="row">
                  {result.id}
                </TableCell>
                <TableCell>{result.cpt}</TableCell>
                <TableCell>{result.lab_company}</TableCell>
                <TableCell>{result.favorite ? "Yes" : "No"}</TableCell>
                <TableCell>{result.billable ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <NumberFormat
                    value={result.fee}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </TableCell>
                <TableCell>{result.client_name}</TableCell>
                <TableCell
                  style={{ cursor: "pointer" }}
                  onClick={() => handleGroupIsOpen(result.cpt_group)}
                >
                  {result.cpt_group
                    ? String(result.cpt_group).length > 22
                      ? `${String(result.cpt_group).slice(0, 22)}...`
                      : String(result.cpt_group)
                    : ""}
                </TableCell>
                <TableCell>
                  {result.updated ? moment(result.updated).format("lll") : ""}
                </TableCell>
                <TableCell>{result.updated_name}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={() =>
                      handleIsOpen(
                        result.id,
                        result.cpt,
                        result.fee,
                        result.favorite,
                        result.billable
                      )
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditCptCodeModal
        isOpen={isOpen}
        hendleOnClose={hendleOnClose}
        cpt_id={cpt_id}
        cpt_description={cpt_description}
        cpt_fee={cpt_fee}
        cpt_favorite={cpt_favorite}
        cpt_billable={cpt_billable}
        cpt_notes={cpt_notes}
        handleChangeFee={handleChangeFee}
        handleChangeFavorite={handleChangeFavorite}
        handleChangeBillable={handleChangeBillable}
        handleChangeNotes={handleChangeNotes}
        handleEditCptCode={handleEditCptCode}
      />
      <CptGroupMembersModal
        isOpen={groupIsOpen}
        hendleOnClose={hendleGroupOnClose}
        groups={groups}
      />
    </div>
  );
};

export default CPTtable;
