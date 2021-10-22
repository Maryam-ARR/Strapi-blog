import React, { useContext } from "react";
import AppContext from "../components/Context/context";
import axios from "axios";
import Cookie from "js-cookie";

const GoogleRedirect = (props) => {
  const appContext = useContext(AppContext);
  return <GoogleRedirectbtw {...props} appContext={appContext} />;
};

class GoogleRedirectbtw extends React.Component {
  constructor(props) {
    super(props);
    this.appContext = props.appContext;
  }
  componentDidMount() {
    const idtoken = this.props.location.search;
    axios
      .get("/auth/google/callback" + idtoken)
      .then((res) => {
        if (res.status === 200) {
          Cookie.set("token", res.data.jwt);
          localStorage.setItem("token", res.data.jwt);
          this.appContext.setUser(res.data.user);
          this.props.history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return <div className="loading"></div>;
  }
}

export default GoogleRedirect;
