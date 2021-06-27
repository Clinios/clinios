import React from "react";

import { Grid, Container } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/MenuOutlined";
import clsx from "clsx";
import PropTypes from "prop-types";
import { NavLink as RouterLink } from "react-router-dom";

import Logo from "../../../../assets/img/Logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
    padding: "20px 0",
    background: "white",
  },
  toolbar: {
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
  },
  loginButton: {
    minHeight: 47,
    maxWidth: 75,
    background: "#335eea",
    fontWeight: 600,
    lineHeight: 1.6,
    borderRadius: ".375rem",
  },
  navLink: {
    color: "#506690",
    textDecoration: "none",
    padding: ".5rem 1rem",
    fontSize: 17,
    fontWeight: 500,

    "&:hover": {
      color: "#335eea",
    },
  },
  container: {
    maxWidth: "1040px",
  },
}));


const Topbar = (props) => {
  const {
    className, onSidebarOpen, ...rest
  } = props;

  const classes = useStyles();

  return (
    <AppBar position="relative" {...rest} className={clsx(classes.root, className)}>
      <Container maxWidth="lg" className={classes.container}>
        <Toolbar className={classes.toolbar} disableGutters>
          <RouterLink to="/dashboard">
            <img src={Logo} alt="Logo" />
          </RouterLink>
          <Hidden mdDown>
            <Grid className={classes.linksContainer}>
              <RouterLink to="/" className={classes.navLink}>
                Home
              </RouterLink>
              <RouterLink to="/resources" className={classes.navLink}>
                Resources
              </RouterLink>
              <RouterLink to="/catalog" className={classes.navLink}>
                Catalog
              </RouterLink>
              <RouterLink to="/about" className={classes.navLink}>
                About
              </RouterLink>
              <RouterLink to="/contact" className={classes.navLink}>
                Contact
              </RouterLink>
            </Grid>
            <a className={classes.link} href="https://app.avonehr.com">
              <Button
                className={classes.loginButton}
                size="large"
                variant="contained"
                color="primary"
                disableElevation
              >
                Login
              </Button>
            </a>
          </Hidden>
          <Hidden lgUp>
            <IconButton onClick={onSidebarOpen}>
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

Topbar.defaultProps = {
  className: null,
  onSidebarOpen: () => { },
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
};

export default Topbar;
