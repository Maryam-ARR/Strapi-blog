import React, { Component } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.appContext = this.props.appContext;
    this.state = {
      reset: false,
      password: "",
      passwordConfirmation: "",
      passwordRegex: false,
      error: "",
      loading: false,
      code: props.match.params.code,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    if (!this.state.code) {
      this.props.history.push("/");
    }
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
    if (
      event.target.name === "password" ||
      event.target.name === "passwordConfirmation"
    ) {
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
    this.setState({ loading: true });
    if (this.state.passwordRegex) {
      axios
        .post("/auth/reset-password", {
          code: this.state.code,
          password: this.state.password,
          passwordConfirmation: this.state.passwordConfirmation,
        })
        .then((res) => {
          if (res.status === 200) {
            this.setState({ reset: true, loading: false });
            setTimeout({}, 2000);
            this.props.history.push("/login");
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
            this.setState({ error, loading: false });
          }
          console.log(err);
        });
    }
  }
  render() {
    return (
      <div className='container-blog'>
        {this.state.reset ? (
          <h2>Password Reseted</h2>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <h2>Reset password</h2>
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
            <div className='form-group'>
              <label>Reenter Password</label>
              <input
                type='password'
                className='form-control'
                name='passwordConfirmation'
                value={this.state.passwordConfirmation}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className='form-group'>{this.state.error}</div>
            <div className='form-group'>
              <Button
                type='submit'
                className='button-tool'
                disabled={this.state.loading || this.state.isCount}>
                {this.state.loading ? "Loading.." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default ResetPassword;
