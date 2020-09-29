import React from "react";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Colors from "../../../../../theme/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  title: {
    backgroundColor: theme.palette.primary.light,
    fontWeight: "600",
    fontSize: "1em",
    "& h2": {
      color: "#fff",
    },
  },
  titleContainer: {
    padding: "0 0 0 1em",
    borderBottom: `1px solid ${Colors.border}`,
    minHeight: 47,
  },
  providers: {
    display: "block",
    listStyle: "none",
    width: "100%",
    "& li": {
      fontSize: "13px",
      display: "flex",
      justifyContent: "space-between",
      listStyle: "none",
      padding: "3px 0px",
      cursor: "pointer",
      "&:hover": {
        background: "#fafafa",
      },
      "& div": {
        flex: 2,
      },
    },
    "& a": {
      fontSize: "13px",
      display: "flex",
      justifyContent: "space-between",
      listStyle: "none",
      padding: "0px 0px",
      cursor: "pointer",
      textDecoration: "none",
      width: "100%",
      color: theme.palette.text.primary,
      "&:hover": {
        background: "#fafafa",
      },
      "& div": {
        flex: 2,
      },
    },
  },
  providersLabel: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  count: {
    width: "30px",
    flex: "1 !important",
  },
}));

const ProviderCards = ({ providers, handleProviderClick }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.titleContainer}
      >
        <Typography className={classes.title}>Provider</Typography>
      </Grid>

      <CardContent>
        <ul className={classes.providers}>
          <li className={classes.providersLabel}>
            <div>Name</div>
            <div className={classes.count}>Count</div>
            <div>Since</div>
          </li>
          {providers &&
            providers.map((provider) => (
              <li
                key={provider.id}
                onClick={() => handleProviderClick(provider)}
              >
                <div>{provider.name}</div>
                <div className={classes.count}>{provider.count}</div>
                <div>{`${moment(provider.dt).format("ll")} (${moment(
                  provider.dt
                )
                  .startOf("day")
                  .fromNow()})`}</div>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProviderCards;
