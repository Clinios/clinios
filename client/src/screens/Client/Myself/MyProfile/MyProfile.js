import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import moment from "moment";

import ForwardEmailService from "../../../../services/forwardEmail.service";
import MyProfileService from "../../../../services/myProfile.service";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { AuthContext } from "../../../../providers/AuthProvider";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { setSuccess, setError } from "../../../../store/common/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "40px 0px",
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
  },
  formElment: {
    marginTop: theme.spacing(2),
    width: "250px",
  },
  submit: {
    width: "100px",
    marginTop: theme.spacing(4),
  },
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix=""
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function MyProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [created, setCreated] = useState(moment().format("YYYY-MM-DD"));
  const [forwardEmails, setForwardEmails] = useState([]);
  const [selectedForwardEmail, setSelectedForwardEmail] = useState(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const saveProfile = (e) => {
    e.preventDefault();

    const [firstname, lastname] = name.split(" ");

    const payload = {
      data: {
        firstname,
        lastname,
        email,
        title,
        created,
        ...(selectedForwardEmail > 0 && {
          email_forward_user_id: selectedForwardEmail,
        }),
        phone,
        ...(password.length && { password }),
      },
    };

    MyProfileService.update(payload, userId).then(
      (res) => {
        dispatch(setSuccess(res.data.message));
      },
      (error) => {
        dispatch(setError(error));
      }
    );
  };

  const userContext = useContext(AuthContext);
  // const userState = useSelector((state) => state.auth.user, shallowEqual);
  useEffect(() => {
    // setUserId(userState.id);
    setUserId(userContext.user.id);
  }, [userContext]);

  useEffect(() => {
    if (userId != null) {
      ForwardEmailService.get(userId).then((res) => {
        setForwardEmails(res.data);
      });

      MyProfileService.get(userId).then((res) => {
        const profile = res.data;
        setName(profile.firstname + " " + profile.lastname);
        setEmail(profile.email);
        setTitle(profile.title);
        setCreated(moment(profile.created).format("YYYY-MM-DD"));
        setSelectedForwardEmail(profile.email_forward_user_id);
        setPhone(profile.phone);
      });
    }
  }, [userId]);

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <Grid container direction="column" justify="center">
          <Typography
            component="h1"
            variant="h2"
            color="textPrimary"
            className={classes.title}
          >
            My Profile
          </Typography>
          <Typography component="p" variant="body2" color="textPrimary">
            This page is used to manage a user's basic information
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={(e) => saveProfile(e)}
          >
            <TextField
              autoFocus
              variant="outlined"
              label="Name"
              value={name}
              className={classes.formElment}
              onChange={(event) => setName(event.target.value)}
              size="small"
            />
            <TextField
              variant="outlined"
              label="Email"
              value={email}
              className={classes.formElment}
              onChange={(event) => setEmail(event.target.value)}
              size="small"
            />
            <TextField
              variant="outlined"
              label="Title"
              value={title}
              className={classes.formElment}
              onChange={(event) => setTitle(event.target.value)}
              size="small"
            />
            <TextField
              variant="outlined"
              id="date"
              label="Created"
              value={created}
              className={classes.formElment}
              onChange={(event) => setCreated(event.target.value)}
              type="date"
              size="small"
            />
            <FormControl
              variant="outlined"
              className={classes.formElment}
              size="small"
            >
              <InputLabel htmlFor="age-native-simple">
                Forwarded Email
              </InputLabel>
              <Select
                native
                value={selectedForwardEmail}
                onChange={(event) => {
                  setSelectedForwardEmail(event.target.value);
                }}
                inputProps={{
                  name: "Forwarded Email",
                  id: "age-native-simple",
                }}
                label="Forwarded Email"
              >
                <option value={-1}>Select User</option>
                {forwardEmails.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              label="Phone"
              value={phone}
              className={classes.formElment}
              onChange={(event) => {
                event.target.value = event.target.value.slice(0, 25);
                setPhone(event.target.value);
              }}
              size="small"
            />
            <TextField
              variant="outlined"
              label="Password"
              value={password}
              type="password"
              className={classes.formElment}
              onChange={(event) => setPassword(event.target.value)}
              size="small"
            />

            <Button
              size="medium"
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
          </form>
        </Grid>
      </div>
    </div>
  );
}
