import React from "react";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import AppContext from "./components/Context/context";
import axios from "axios";
import Cookie from "js-cookie";
import ErrorBoundary from "./Utils/ErrorBoundary";
import Routes from "./pages/_Routes";

import "./Utils/css/scss.scss";

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
    this.setUser = this.setUser.bind(this);
    this.getUser = this.getUser.bind(this);
  }
  componentDidMount() {
    this.getUser();
  }
  getUser() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    if (!this.state.user) {
      token &&
        axios
          .get("/users/me", {
            headers: {
              Authorization: "Bearer " + (token ? token : ""),
            },
          })
          .then((res) => {
            if (res.status === 200) {
              Cookie.set("token", token);
              localStorage.setItem("token", token);
              this.setUser(res.data);
            }
          })
          .catch((err) => {
            Cookie.remove("token");
            localStorage.removeItem("token");
            this.setUser(null);
            console.log(err);
          });
    }
  }

  setUser = (user) => {
    this.setState({ user });
  };

  render() {
    return (
      <Router history={history}>
        <ErrorBoundary>
          <AppContext.Provider
            value={{
              user: this.state.user,
              isAuthenticated: !!this.state.user,
              setUser: this.setUser,
              getUser: this.getUser,
            }}>
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </Router>
    );
  }
}

export default App;
