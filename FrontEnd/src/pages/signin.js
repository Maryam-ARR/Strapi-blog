import React, { useContext } from "react";
import { Snackbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import AppContext from "../components/Context/context";
import axios from "axios";
import Button from "@material-ui/core/Button";
import ReCAPTCHA from "react-google-recaptcha";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "@material-ui/lab/Alert";

const Signin = (props) => {
  const appContext = useContext(AppContext);
  return <Signinbtw {...props} appContext={appContext} />;
};
const Googlebtn = () => {
  const gooleLink = process.env.REACT_APP_SERVER_NAME + "/connect/google";
  return (
    <Link to={{ pathname: gooleLink }} className='lo' target='_blank'>
      <div className='ap'>
        <svg width='25' height='25' className='vc'>
          <g fill='none' fillRule='evenodd'>
            <path
              d='M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z'
              fill='#4285F4'></path>
            <path
              d='M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z'
              fill='#34A853'></path>
            <path
              d='M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.49 8.49 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z'
              fill='#FBBC05'></path>
            <path
              d='M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z'
              fill='#EA4335'></path>
          </g>
        </svg>
        Sign up with Google
      </div>
    </Link>
  );
};

class Signinbtw extends React.Component {
  constructor(props) {
    super(props);
    this.appContext = this.props.appContext;
    this.state = {
      openS: false,
      openE: false,
      passwordRegex: false,
      loading: false,
      error: "",
      username: "",
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
    if (event.target.name === "password") {
      const regex = RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]*).{8,}$"
      );
      const test = regex.test(event.target.value);
      if (!test) {
        this.setState({
          error: (
            <div className='invalid-feedback'>
              At least one upper case <br />
              At least one lower case
              <br />
              At least one digit
              <br />
              Minimum eight in length
            </div>
          ),
          passwordRegex: false,
        });
      } else {
        this.setState({
          error: "",
          passwordRegex: true,
        });
      }
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.passwordRegex) {
      this.setState({ loading: true });
      axios
        .post("/auth/local/register", {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
        })
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false, openS: true });
            this.props.history.push({
              pathname: "/sendemailconfirmation",
              email: this.state.email,
            });
          }
        })
        .catch((err) => {
          if (err.response?.status === 400) {
            const error = err?.response?.data?.message.map((error) => {
              return (
                <div className='invalid-feedback' key={error.messages[0].id}>
                  {error.messages[0]?.message}
                </div>
              );
            });
            this.setState({ error, loading: false, openE: true });
          }
          console.log(err);
        });
    }
  }
  handleClose() {
    this.setState({ openE: false, openS: false });
  }
  render() {
    return (
      <div className='container-blog '>
        <div className=' group relative'>
          <div className=' relative mt-12 mx-auto bg-white p-9 shadow-lg rounded-md z-90'>
            <h2>Sign in</h2>
            <div className='tr'>
              <Googlebtn className={Googlebtn} />
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className='form-group'>
                <label>Username</label>
                <input
                  type='text'
                  className='form-control'
                  name='username'
                  value={this.state.username}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Email</label>
                <input
                  type='email'
                  className='form-control'
                  name='email'
                  value={this.state.email}
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
              <ReCAPTCHA
                className='flex-center'
                sitekey={process.env.REACT_APP_CLIENT_NAME}
              />
              <div className='form-group'>{this.state.error}</div>
              <Button
                type='submit'
                className='button-tool'
                disabled={this.state.loading}>
                {this.state.loading ? "Loading.." : "Submit"}
              </Button>
            </form>
          </div>
          <div className='login login1'></div>
          <div className='login login2'></div>
          <div className='login login3'></div>
          <div className='login login4'></div>
          <div className='login login5'></div>
        </div>
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
    );
  }
}

export default Signin;
