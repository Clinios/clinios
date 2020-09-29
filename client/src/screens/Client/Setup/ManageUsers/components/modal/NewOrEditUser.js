import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Switch from "@material-ui/core/Switch";
import Alert from "@material-ui/lab/Alert";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { makeStyles } from "@material-ui/core/styles";
import { colors } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setSuccess } from "../../../../../../store/common/actions";
import { removeEmpty } from "../../../../../../utils/helpers";
import manageUsersService from "../../../../../../services/manageUsers.service";


const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.light,
    "& h2": {
      color: "#fff",
    },
  },
  content: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: "18px",
  },
  formgroup: {
    marginLeft: '-3px',
  },
  formControl: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: theme.palette.text.secondary,
    "& .MuiSelect-select": {
      minWidth: 120,
    },
  },
  formLabel: {
    fontSize: "14px",
    fontWeight: "600",
    width: "220px",
  },
  formHelperText: {
    width: "220px",
    fontSize: "12px",
    paddingLeft: "16px",
  },
  formField: {
    flex: 1,
  },
  adjacentField: {
    flex: 0.45,
  },
  halfField: {
    flex: 0.5,
  },
  modalAction: {
    borderTop: `1px solid ${theme.palette.background.default}`,
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
    padding: '40px 0px',
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  status: {
    display: 'flex',
    alignItems: 'center',
  },
  subject: {
    width: '50%',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
  },
  texArea: {
    height: '250px !important',
    width: '75%',
    padding: '5px',
  },
  next: {
    margin: theme.spacing(3, 0, 2),
    maxWidth: '100px',
  },
  historyTop: {
    marginTop: '15px',
  },
  history: {
    marginTop: '5px',
    display: 'flex',
    border: 'black solid 1px',
    padding: '5px',
    height: '300px',
    flexDirection: 'row',
    '& div': {
      width: '16%',
      margin: '5px',
    },
  },
}));

const NewOrEditUser = ({
  isOpen,
  onClose,
  prevuser,
  isNewUser,
  type,
  status,
  schedule,
  forward,
  ...props
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let appt = null;
    if (!isNewUser) {
      appt = {
        ...props.selectedUser,
        updated: props.selectedUser.updated,
        created: props.selectedUser.created,
        email_forward_user_id: props.forward,
      };
    } else {
      appt = {
        firstname: '',
        lastname: '',
        title: '',
        email: '',
        status: 'Active',
        updated: new Date() ,
        created: new Date() ,
        type: 'Primary Provider',
        appointments: true,
        admin: false,
        schedule: 'Full',
        email_forward_user_id: props.forward,
        comment: '',
      }
    }
    console.log(appt)
    setUser(appt);

  }, [props.selectedUser]);

  const handleOnChange = (event) => {
    console.log(event.target.name, " " ,event.target.value.trim())
    setUser({
      ...user,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleFormSubmission = () => {
    console.log(prevuser)
    const formedData = {
      userReq: removeEmpty({
        firstname: user.firstname,
        lastname: user.lastname,
        title: user.title,
        email: user.email,
        status: user.status,
        updated: user.updated,
        created: user.created,
        type: user.type,
        appointments: user.appointments,
        admin: user.admin,
        schedule: user.schedule,
        email_forward_user_id: user.email_forward_user_id,
        comment: user.comment,

        created_user_id: prevuser.id,
        updated_user_id: prevuser.id,
        client_id: prevuser.client_id,
      }),
    };
    if (isNewUser) {
      createNewUser(formedData);
      console.log("new");
    } else {
      delete formedData.userReq.created_user_id;
      console.log("Update", user);

      manageUsersService.update(formedData, prevuser.id).then(
        (response) => {
          dispatch(setSuccess(`${response.data.message}`));
          onClose();
        },
        (error) => {
          const errorData = [];
          errorData.push({ msg: error.response.data.error });
          console.log(errorData)

          setErrors(errorData);
        }
      );
    }
  };

  const createNewUser = (data) => {
      
    data.userReq.status  = data.userReq.status == undefined ? 'Active' : data.userReq.status;
    data.userReq.type = data.userReq.type == undefined ?  'Primary Provider': data.userReq.type;
    data.userReq.appointments  = data.userReq.appointments == undefined ?  true: data.userReq.appointments ;
    data.userReq.admin = data.userReq.admin == undefined ?  false : data.userReq.admin;
    data.userReq.schedule = data.userReq.schedule == undefined ? 'Full' : data.userReq.schedule;
    // data.userReq.forward = data.userReq.forward == undefined ? forward : data.userReq.forward;
    
    console.log(data);

    manageUsersService.create(data).then(
      (response) => {
        dispatch(setSuccess(`${response.data.message}`));
        onClose();
      },
      (error) => {
        const errorData = [];
        errorData.push({msg:error.response.data.error});
        console.log(errorData)

        setErrors(errorData);
      }
    );
  };

  return (
    <div>
      <Dialog
        open={ isOpen }
        onClose={ onClose }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={ fullScreen }
        fullWidth={ true }
        maxWidth={ 'sm' }
      >
        <DialogTitle id="alert-dialog-title" className={ classes.title }>
          { isNewUser ? "New User" : "Edit User" }
        </DialogTitle>
        <DialogContent className={ classes.content }>
          <DialogContentText id="alert-dialog-description">
            { isNewUser
              ? "This page is used to create a new user"
              : "This page is used to update a user" }
          </DialogContentText>
          { errors &&
            errors.map((error, index) => (
              <Alert severity="error" key={ index }>
                {error.msg }
              </Alert>
            )) }
          <div className={ classes.root }>
            <FormControl component="div" className={ classes.formControl }>

              <TextField
                className={ classes.subject }
                value={ user.firstname }
                variant="outlined"
                margin="dense"
                id="firstname"
                label="Firstname"
                name="firstname"
                autoComplete="subject"
                autoFocus
                onChange={ (event) => handleOnChange(event) }
              />

              <FormGroup aria-label="position" row className={ classes.formgroup}>
                <FormControlLabel
                  value="appointments"
                  control={ <Switch
                    checked={ user.appointments }
                    onChange={ (event) =>
                      {
                      setUser({
                        ...user,
                        [event.target.name]: !user.appointments,
                      })
                    }
                    }
                    name="appointments"
                    inputProps={ { "aria-label": "primary checkbox" } }
                  /> }
                  label="Appointments"
                  labelPlacement="top"
                />
              </FormGroup>

            </FormControl>

            <FormControl component="div" className={ classes.formControl }>
              <TextField
                className={ classes.adjacentField }
                variant="outlined"
                margin="dense"
                fullWidth
                name="lastname"
                label="Lastname"
                id="lastname"
                autoComplete="lastname"
                onChange={ (event) => handleOnChange(event) }
                value={ user.lastname }

              />
              <TextField
                id="type"
                label="Type"
                name="type"
                select
                className={ classes.adjacentField }
                value={ user.type }
                onChange={ (event) => handleOnChange(event) }
                SelectProps={ {
                  native: true,
                  MenuProps: {
                    className: classes.menu,
                  },
                } }
                margin="dense"
                variant="outlined"
              >
                { type.map(option => (
                  <option key={ option.value } value={ option.value }>
                    {option.label }
                  </option>
                )) }
              </TextField>

            </FormControl>
            <FormControl component="div" className={ classes.formControl }>
              <TextField
                className={ classes.adjacentField }
                variant="outlined"
                margin="dense"
                fullWidth
                name="title"
                label="Title"
                id="title"
                autoComplete="title"
                onChange={ (event) => handleOnChange(event) }
                value={ user.title }
              />

              <TextField
                id="schedule"
                label="Schedule"
                select
                name="schedule"
                className={ classes.adjacentField }
                value={ user.schedule }
                onChange={ (event) => {handleOnChange(event)} }
                SelectProps={ {
                  native: true,
                  MenuProps: {
                    className: classes.menu,
                  },
                } }
                margin="dense"
                variant="outlined"
              >
                { schedule.map(option => (
                  <option key={ option.value } value={ option.value }>
                    {option.label }
                  </option>
                )) }
              </TextField>
            </FormControl>
            <FormControl component="div" className={ classes.formControl }>
              <TextField
                className={ classes.adjacentField }
                variant="outlined"
                margin="dense"
                fullWidth
                name="email"
                label="Emal"
                id="email"
                autoComplete="email"
                onChange={ (event) => handleOnChange(event) }
                value={ user.email }
              />

              <TextField
                id="forward"
                label="Forward"
                name="email_forward_user_id"
                select
                className={ classes.adjacentField }
                value={ user.email_forward_user_id }
                onChange={ (event) => handleOnChange(event) }
                SelectProps={ {
                  native: true,
                  MenuProps: {
                    className: classes.menu,
                  },
                } }
                margin="dense"
                variant="outlined"
              >
                { forward.map(option => (
                  <option key={ option.value } value={ option.value }>
                    {option.label }
                  </option>
                )) }
              </TextField>

            </FormControl>
            <FormControl component="div" className={ classes.formControl }>

              <TextField
                id="status"
                label="Status"
                name="status"
                select
                className={ classes.adjacentField }
                value={ user.status }
                onChange={ (event) => handleOnChange(event) }
                SelectProps={ {
                  native: true,
                  MenuProps: {
                    className: classes.menu,
                  },
                } }
                margin="dense"
                variant="outlined"
              >
                { status.map(option => (
                  <option key={ option.value } value={ option.value }>
                    {option.label }
                  </option>
                )) }
              </TextField>

            </FormControl>

            <FormControl component="div" className={ classes.formControl } ml={ -13 }>
              <FormGroup aria-label="position" row >
                <FormControlLabel
                  value="admin"
                  control={ <Switch
                    checked={ user.admin }
                    onChange={ (event) =>{
                      setUser({
                        ...user,
                        [event.target.name]: !user.admin,
                      })
                    }
                    }
                    name="admin"
                    inputProps={ { "aria-label": "primary checkbox" } }
                  /> }
                  label="Administrator"
                  labelPlacement="top"
                />
              </FormGroup>

            </FormControl>

            <FormControl component="div" className={ classes.formControl }>
              <TextField
                className={ classes.adjacentField }
                variant="outlined"
                margin="dense"
                fullWidth
                name="updated"
                label="Updated"
                id="updated"
                autoComplete="updated"
                onChange={ (event) => handleOnChange(event) }
                value={ user.updated !=undefined ? moment(user.updated).format("lll") : "-"  }
              />

            </FormControl>

            <FormControl component="div" className={ classes.formControl }>
              <TextField
                className={ classes.adjacentField }
                variant="outlined"
                margin="dense"
                fullWidth
                name="created"
                label="Created"
                id="created"
                autoComplete="created"
                onChange={ (event) => handleOnChange(event) }
                value={ user.created != undefined ? moment(user.created).format("lll") : "-" }
              />
              <TextField
                size={ 'medium' }
                className={ classes.halfField }
                variant="outlined"
                multiline
                name="comment"
                label="Notes"
                id="comment"
                InputProps={ {
                  classes: classes.normalOutline,
                  inputComponent: TextareaAutosize,
                  rows: 4,
                } }
                value={ user.comment }
                onChange={ (event) => handleOnChange(event) }
              />
            </FormControl>


          </div>
        </DialogContent>
        <DialogActions className={ classes.modalAction }>
          <Button
            size="small"
            variant="outlined"
            onClick={ () =>{ 
              setErrors([])
              onClose() }}
            style={ {
              borderColor: colors.orange[600],
              color: colors.orange[600],
            } }
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={ () => handleFormSubmission() }
          >
            { isNewUser ? "Save" : "Update" }
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
};

export default NewOrEditUser;
