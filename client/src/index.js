import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import configureStore from "./store/configureStore";
import CustomSnackbar from "./components/common/CustomSnackbar";
import * as serviceWorker from "./serviceWorker";
import NetworkService from "./network-service";
import "./index.css";

const store = configureStore();
NetworkService.setupInterceptors(store);
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <React.Fragment>
        <App />
        <CustomSnackbar />
      </React.Fragment>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
