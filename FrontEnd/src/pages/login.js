import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../components/Context/context";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Cookie from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

const Login = (props) => {
  const appContext = useContext(AppContext);
  return <Loginbtw {...props} appContext={appContext} />;
};

class Loginbtw extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.appContext = props.appContext;
    this.state = {
      openS: false,
      openE: false,
      loading: false,
      error: "",
      identifier: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post("auth/local", {
        identifier: this.state.identifier,
        password: this.state.password,
      })
      .then((res) => {
        if (res.status === 200) {
          Cookie.set("token", res.data.jwt);
          localStorage.setItem("token", res.data.jwt);
          this.appContext.setUser(res.data.user);
          this.setState({ loading: false, openS: true });
          this.props.history.push("/");
        }
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          const error = err.response.data.message.map((error) => {
            return (
              <div className='invalid-feedback' key={error.messages[0].id}>
                {error.messages[0].message}
              </div>
            );
          });
          this.setState({ error, loading: false, openE: true });
        }
        console.log(err);
      });
  }
  handleClose() {
    this.setState({ openE: false, openS: false });
  }
  render() {
    return (
      <div className='container-blog'>
        <div className=' group relative'>
          <div className=' relative mt-12 mx-auto bg-white p-9 shadow-lg rounded-md z-90'>
            <h2>Log in</h2>
            <form onSubmit={this.handleSubmit}>
              <div className='form-group'>
                <label>Email or Username</label>
                <input
                  type='text'
                  className='form-control'
                  name='identifier'
                  value={this.state.identifier}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Password</label>
                <input
                  type='password'
                  className='form-control'
                  name='password'
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className='form-group'>{this.state.error}</div>
              <ReCAPTCHA
                className='flex-center'
                sitekey={process.env.REACT_APP_CLIENT_NAME}
              />
              <Button
                type='submit'
                className='button-tool'
                disabled={this.state.loading}>
                {this.state.loading ? "Loading... " : "Submit"}
              </Button>
              <div className='flex-center'>
                <Link to='/forgetpassword' className='text-muted mr-1'>
                  forgot password
                </Link>
                <span> or </span>
                <Link to='/signin' className='text-muted ml-1'>
                  register
                </Link>
              </div>
            </form>
          </div>
          <div className='login login1'></div>
          <div className='login login2'></div>
          <div className='login login3'></div>
          <div className='login login4'></div>
          <div className='login login5'></div>
          <Snackbar
            className='snackbar-fixed'
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={this.state.openS}
            autoHideDuration={2000}
            onClose={this.handleClose}>
            <Alert
              className='alert-fixed'
              severity='success'
              icon={<FontAwesomeIcon icon={faCheckCircle} />}>
              Succès !
            </Alert>
          </Snackbar>
          <Snackbar
            className='snackbar-fixed'
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={this.state.openE}
            autoHideDuration={2000}
            onClose={this.handleClose}>
            <Alert
              className='alert-fixed'
              severity='error'
              icon={<FontAwesomeIcon icon={faTimes} />}>
              Erreur !
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  }
}

export default Login;
