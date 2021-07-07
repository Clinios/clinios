import React, { useState } from "react";

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
import EditIcon from "@material-ui/icons/EditOutlined";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import { useSnackbar } from "notistack";
import Proptypes from "prop-types";
import NumberFormat from "react-number-format";

import Dialog from "../../../../../components/Dialog";
import useAuth from "../../../../../hooks/useAuth";
import ProcedureCodesService from "../../../../../services/procedure.service";
import EditProcedureCodeModal from "./modal/EditProcedureCodeModal";
import ProcedureGroupMembersModal from "./modal/ProcedureGroupMembersModal";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    minWidth: 450,
    marginTop: theme.spacing(2),
  },
  noWrap: {
    whiteSpace: "noWrap",
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

const ProcedureTable = ({ searchResult, fetchProcedureCodeSearch }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [errors, setErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [groupIsOpen, setGroupIsOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const [procId, setProcId] = useState("");
  const [procedure_description, set_procedure_description] = useState("");
  const [procedure_favorite, set_procedure_favorite] = useState("");
  const [procedure_fee, set_procedure_fee] = useState("");
  const [procedure_billable, set_procedure_billable] = useState("");
  const [procedure_notes, set_procedure_notes] = useState("");

  const payload = {
    procedureId: procId,
    favorite: procedure_favorite,
    billable: procedure_billable,
    fee: procedure_fee,
    notes: procedure_notes,
  };

  const handleIsOpen = (id, desc, fee, fav, bill) => {
    setProcId(id);
    set_procedure_description(desc);
    set_procedure_fee(fee);
    set_procedure_favorite(fav);
    set_procedure_billable(bill);
    setIsOpen(true);
  };
  const hendleOnClose = () => {
    setIsOpen(false);
  };

  const hendleGroupOnClose = () => {
    setGroupIsOpen(false);
  };

  const handleGroupIsOpen = (group) => {
    const getListOfGroup = String(group).split(";");
    const data = [];
    getListOfGroup.map((g) => {
      searchResult.filter((c) => {
        if (String(c.proc) === g.trim()) {
          const list = {
            id: c.id,
            description: c.proc,
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
    set_procedure_fee(e.target.value);
  };
  const handleChangeFavorite = (e) => {
    set_procedure_favorite(e.target.checked);
  };
  const handleChangeBillable = (e) => {
    set_procedure_billable(e.target.checked);
  };

  const handleChangeNotes = (e) => {
    set_procedure_notes(e.target.value);
  };

  const handleEditProcedureCode = () => {
    ProcedureCodesService.updateClientProcedure(procId, user.id, payload).then(
      (response) => {
        setTimeout(() => {
          enqueueSnackbar(`${response.data.message}`, {
            variant: "success",
          });
        }, 300);
      },
      (error) => {
        setTimeout(() => {
          setErrors(error.response.error);
        }, 300);
      },
    );
    setIsOpen(false);
    setTimeout(() => {
      fetchProcedureCodeSearch();
    }, 200);
  };

  return (
    <div>
      {errors
        && errors.map((error, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Alert severity="error" key={index}>
            {error.msg}
          </Alert>
        ))}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox" align="center">
                Procedure ID
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Procedure Description
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Lab Company
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Favorite
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Billable
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Fee
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Client
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Group
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Updated
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Updated By
              </StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResult.map((result) => (
              <StyledTableRow key={result.id}>
                <TableCell
                  component="th"
                  scope="row"
                  padding="checkbox"
                  align="center"
                >
                  {result.id}
                </TableCell>
                <TableCell padding="checkbox" align="left" className={classes.noWrap}>
                  {result.proc}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  {result.lab_company}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  {result.favorite ? "Yes" : ""}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  {result.billable ? "Yes" : ""}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  <NumberFormat
                    value={result.fee}
                    displayType="text"
                    thousandSeparator
                    prefix="$"
                  />
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  {result.client_name}
                </TableCell>
                <TableCell
                  padding="checkbox"
                  align="center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleGroupIsOpen(result.procedure_group)}
                >
                  {result.procedure_group
                    ? String(result.procedure_group).length > 14
                      ? `${String(result.procedure_group).slice(0, 14)}...`
                      : String(result.procedure_group)
                    : ""}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  {result.updated ? moment(result.updated).format("MMM DD YYYY") : ""}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  {result.updated_name}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleIsOpen(
                      result.id,
                      result.proc,
                      result.fee,
                      result.favorite,
                      result.billable,
                    )}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isOpen && (
        <Dialog
          open={isOpen}
          title="Edit Procedure"
          message={(
            <EditProcedureCodeModal
              procId={procId}
              procedure_description={procedure_description}
              procedure_fee={procedure_fee}
              procedure_favorite={procedure_favorite}
              procedure_billable={procedure_billable}
              procedure_notes={procedure_notes}
              handleChangeFee={handleChangeFee}
              handleChangeFavorite={handleChangeFavorite}
              handleChangeBillable={handleChangeBillable}
              handleChangeNotes={handleChangeNotes}
              handleEditProcedureCode={handleEditProcedureCode}
            />
          )}
          cancelForm={hendleOnClose}
          hideActions
          size="sm"
        />
      )}
      <ProcedureGroupMembersModal
        isOpen={groupIsOpen}
        hendleOnClose={hendleGroupOnClose}
        groups={groups}
      />
    </div>
  );
};

ProcedureTable.propTypes = {
  searchResult: Proptypes.arrayOf(
    Proptypes.shape({
      id: Proptypes.string,
      proc: Proptypes.string,
      lab_company: Proptypes.string,
      favorite: Proptypes.bool,
      billable: Proptypes.bool,
      fee: Proptypes.number,
      client_name: Proptypes.string,
      procedure_group: Proptypes.string,
      updated: Proptypes.string,
      updated_name: Proptypes.string,
    }),
  ).isRequired,
  fetchProcedureCodeSearch: Proptypes.func.isRequired,
};

export default ProcedureTable;
