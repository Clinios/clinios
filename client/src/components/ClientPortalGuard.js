import React from "react";

import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ClientPortalGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login_client" />;
  }

  if (user.role !== "CLIENT") {
    return <Redirect to="/protected-area" />;
  }

  return (
    <>
      {children}
    </>
  );
};

ClientPortalGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ClientPortalGuard;
