import React, { useState, useEffect } from "react";
import moment from "moment";
import clsx from "clsx";
import { NavLink as RouterLink } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Hidden from "@material-ui/core/Hidden";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";

import { useDispatch } from "react-redux";
import DropdownItems from "./DropdownItems";
import useDebounce from "./../../../../hooks/useDebounce";
import * as API from "./../../../../utils/API";

import { SearchResults } from "./components";
import { logOut } from "./../../../../store/auth/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  flexGrow: {
    flexGrow: 1,
  },
  toolbar: {
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  headerWithNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    display: "none",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 700,
    fontSize: "18px",
    marginRight: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    "& a": {
      color: theme.palette.white,
      textDecoration: "none",
    },
  },
  navs: {
    display: "block",
  },
  link: {
    color: "#ffffff",
    padding: "10px 15px",
    textDecoration: "none",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  grow: {
    flexGrow: 0,
  },
  headerWithSearchBar: {
    display: "flex",
    justifyContent: "space-between",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      alignItems: "center",
    },
  },
  name: {
    marginRight: theme.spacing(2),
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
}));

const pages = [
  {
    title: "Home",
    href: "/dashboard",
  },
  {
    title: "Manage",
    href: "/dashboard/manage",
    subMenus: [
      {
        title: "Accounting Search",
        href: "/manage/accounting-search",
      },
      {
        title: "Email Patients",
        href: "/manage/email-patients",
      },
      {
        title: "Fax",
        href: "/manage/fax",
      },
      {
        title: "Merge Patient",
        href: "/manage/merge-patient",
      },
      {
        title: "Delete Patient",
        href: "/manage/delete-patient",
      },
      {
        title: "Patient Search",
        href: "/manage/patient-search",
      },
      {
        title: "Support Center",
        href: "/manage/support",
      },
    ],
  },
  {
    title: "Setup",
    href: "/setup",
    subMenus: [
      {
        title: "Accounting Types",
        href: "/setup/accounting-types",
      },
      {
        title: "Appointment Types",
        href: "/setup/appointment-types",
      },
      {
        title: "Appointment Types User Assignment",
        href: "/setup/appoinment-user-types",
      },
      {
        title: "Backup",
        href: "/setup/backup",
      },
      {
        title: "Configuration",
        href: "/setup/configuration",
      },
      {
        title: "CPT Codes",
        href: "/setup/ctp-codes",
      },
      {
        title: "Drugs",
        href: "/setup/drugs",
      },
      {
        title: "Forms",
        href: "/setup/forms",
      },
      {
        title: "Handouts",
        href: "/setup/handouts",
      },
      {
        title: "ICD Codes",
        href: "/setup/icd-codes",
      },
      {
        title: "Integrations",
        href: "/setup/integrations",
      },
      {
        title: "Lab Ranges",
        href: "/setup/lab-ranges",
      },
      {
        title: "Patient Portal Header",
        href: "/setup/patient-portal-header",
      },
      {
        title: "Schedule",
        href: "/setup/schedule",
      },
      {
        title: "Users",
        href: "/setup/users",
      },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
  },
  {
    title: "Myself",
    href: "/myself",
  },
  {
    title: "Logout",
    href: "/",
    logout: true,
  },
];

const Topbar = (props) => {
  const { className, onSidebarOpen, logout, user, ...rest } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const handleClose = (event) => {
    setOpen(false);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedSearchTerm) {
        // Fire off our API call
        API.search(debouncedSearchTerm).then(
          (response) => {
            const { data } = response;
            setResults(data);
          },
          (error) => {
            console.log("search error", error);
          }
        );
      } else {
        setResults([]);
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearchTerm]
  );
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logOut());
    logout();
    window.location.reload();
  };

  return (
    <AppBar { ...rest } className={ clsx(classes.root, className) }>
      <Toolbar className={ classes.toolbar }>
        <div className={ classes.headerWithNav }>
          <Typography className={ classes.title } variant="h6" noWrap>
            <RouterLink to="/dashboard" className={ classes.titleAsLogo }>
              Clinios
            </RouterLink>
          </Typography>
          <Hidden mdDown>
            <div className={ classes.navs }>
              { pages.map((page, index) =>
                page["subMenus"] ? (
                  <DropdownItems
                    parentItem={ page.title }
                    menuItems={ page["subMenus"] }
                    key={ index }
                  />
                ) : (
                    <Button key={ page.title }>
                      <RouterLink
                        to={ page.href }
                        className={ classes.link }
                        onClick={ page.logout && handleLogout }
                      >
                        { page.title }
                      </RouterLink>
                    </Button>
                  )
              ) }
            </div>
          </Hidden>
        </div>
        <Hidden mdDown>
          <div className={ classes.grow } />
          <div className={ classes.headerWithSearchBar }>
            <div className={ classes.sectionDesktop }>
              <div className={ classes.name }>
                { user && `${user.firstname} ${user.lastname}` }
              </div>
              <div className={ classes.date }>
                { moment().format("ddd, MMM Do") }
              </div>
            </div>

            <div className={ classes.search }>
              <div className={ classes.searchIcon }>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                onChange={ (e) => setSearchTerm(e.target.value) }
                classes={ {
                  root: classes.inputRoot,
                  input: classes.inputInput,
                } }
                inputProps={ { "aria-label": "search" } }
              />
              { !!searchTerm && (
                <SearchResults
                  open={ open }
                  handleClose={ handleClose }
                  results={ results }
                  noContent={
                    !!searchTerm && results.length < 1 && "Nothing found!"
                  }
                />
              ) }
            </div>
          </div>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={ onSidebarOpen }>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
};

export default Topbar;
