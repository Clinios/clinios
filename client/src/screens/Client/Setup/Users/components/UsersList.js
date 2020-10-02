import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        minWidth: 650,
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
            height: "50px"
        },
    },
}))(TableRow);

const UsersList = ({ users, onEdit, onDelete, ...props }) => {

    const classes = useStyles();
    return (
        <TableContainer component={ Paper } className={ classes.tableContainer }>
            <Table className={ classes.table } aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Firstname</StyledTableCell>
                        <StyledTableCell>Lastname</StyledTableCell>
                        <StyledTableCell>Title</StyledTableCell>
                        <StyledTableCell>Email</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell align="center">Type</StyledTableCell>
                        <StyledTableCell>Schedule</StyledTableCell>
                        <StyledTableCell>Appointments</StyledTableCell>
                        <StyledTableCell>Admin</StyledTableCell>
                        <StyledTableCell>Note</StyledTableCell>
                        <StyledTableCell>Created</StyledTableCell>
                        <StyledTableCell>Created By</StyledTableCell>
                        <StyledTableCell>Updated</StyledTableCell>
                        <StyledTableCell>Updated By</StyledTableCell>
                        <StyledTableCell /*align="center"*/>Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { users.map((user) => (
                        <StyledTableRow key={ user.firstname + user.email }>
                            <TableCell component="th" scope="row">
                                { user.firstname }
                            </TableCell>
                            <TableCell component="th" scope="row">
                                { user.lastname }
                            </TableCell>
                            <TableCell>{ user.title }</TableCell>
                            <TableCell>{ user.email }</TableCell>
                            <TableCell>
                                { user.status === 'A' ? 'Active' 
                                    : user.status === 'I' ? 'Inactive' : user.status === 'D' ? 'Deleted' : ''}
                            </TableCell>
                            <TableCell>{ user.type === 'PP' ? 'Primary Provider' 
                            : user.type === 'SP' ? 'Secondary Provider' 
                            : user.type === 'A' ? 'Administrative' 
                            : user.type === 'L' ? 'Limited' : ''  }</TableCell>
                            <TableCell align="center">{ user.schedule === 'F' ? 'Full' 
                            :user.schedule === 'H' ? 'Half' 
                            :user.schedule === 'Q' ? 'Quarter' : '' }</TableCell>
                            <TableCell>{ user.appointments ? "Yes" : "No" }</TableCell>
                            <TableCell>{ user.admin ? "Yes" : "No" }</TableCell>
                            <TableCell>{ user.note }</TableCell>
                            <TableCell>
                                { moment(user.created).format("lll") }
                            </TableCell>
                            <TableCell>{ user.created_user }</TableCell>
                            <TableCell> { user.updated
                                ? moment(user.updated).format("lll")
                                : "-" }</TableCell>
                            <TableCell>{ user.updated_user }</TableCell>

                            <TableCell className={ classes.actions }>
                                <IconButton
                                    aria-label="edit"
                                    className={ classes.margin }
                                    onClick={ () => {
                                        onEdit(user.id)
                                    } }
                                >
                                    <EditIcon fontSize="medium" />
                                </IconButton>
                              
                            </TableCell>
                        </StyledTableRow>
                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersList;
