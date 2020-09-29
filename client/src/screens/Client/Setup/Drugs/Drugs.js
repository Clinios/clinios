import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  makeStyles,
  Card,
  CardContent,
  Container,
  CssBaseline,
} from "@material-ui/core";
import Video from "./../../../../components/videos/Video";
import Drugstable from "./components/Drugstable";
import Drugsform from "./components/Drugsform";
import DrugsService from "../../../../services/drugs.service";
import { AuthConsumer } from "../../../../providers/AuthProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "40px 0px",
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  action: {
    textTransform: "none",
    marginTop: theme.spacing(2),
  },

  card: {
    minHeight: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function Drugs() {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const payload = {
    searchTerm,
    checkBox: favorite,
  };

  const fetchSearchDrugs = () => {
    DrugsService.search(payload).then((res) => {
      setSearchResult(res.data.data);
    });
  };

  const textChangeHandler = (e) => {
    setSearchTerm(e.target.value);
  };
  const checkBoxChangeHandler = (e) => {
    setFavorite(e.target.checked);
  };

  return (
    <AuthConsumer>
      {({ user }) => (
        <React.Fragment>
          <CssBaseline>
            <Container maxWidth={false} className={classes.root}>
              <Grid container justify="center" spacing={2}>
                <Grid item md={12} xs={12}>
                  <Typography
                    component="h1"
                    variant="h2"
                    color="textPrimary"
                    className={classes.title}
                  >
                    Drugs
                  </Typography>
                  <Typography component="p" variant="body2" color="textPrimary">
                    This page is used to manage drugs information.
                  </Typography>
                  <Drugsform
                    fetchSearchDrugs={fetchSearchDrugs}
                    textChangeHandler={textChangeHandler}
                    checkBoxChangeHandler={checkBoxChangeHandler}
                  />
                  {searchResult.length > 0 && (
                    <Drugstable
                      user={user}
                      result={searchResult}
                      fetchSearchDrugs={fetchSearchDrugs}
                    />
                  )}
                </Grid>
                <Grid item md={12} xs={12}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h4" gutterBottom>
                        <Video url="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </CssBaseline>
        </React.Fragment>
      )}
    </AuthConsumer>
  );
}
