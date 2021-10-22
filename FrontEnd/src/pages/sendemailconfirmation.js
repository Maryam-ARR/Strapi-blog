import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";

class Sendemailconfirmation extends Component {
  constructor(props) {
    super(props);
    this.appContext = this.props.appContext;
    this.state = {
      count: 7,
      isCount: true,
      loading: false,
      sent: false,
      error: "",
      email: props.location.email,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    if (!this.state.email) {
      this.props.history.push("/");
    }
    var intervalId = setInterval(() => {
      this.setState({ count: this.state.count - 1 });
      if (this.state.count === 0) {
        clearInterval(intervalId);
        this.setState({ isCount: false });
      }
    }, 1000);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post("/auth/send-email-confirmation", {
        email: this.state.email,
      })
      .then((response) => {
        this.setState({ loading: false, sent: true });
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
          this.setState({ error, loading: false });
        }
      });
  }
  render() {
    return (
      <div className='text-center p-4'>
        {this.state.sent ? (
          <h2>Email confirmation Resent to {this.state.email}</h2>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <h2>Email confirmation sent!</h2>

            <div className='form-group'>{this.state.error}</div>
            <Button
              type='submit'
              className='button-tool'
              disabled={this.state.loading || this.state.isCount}>
              {this.state.count !== 0
                ? this.state.count
                : this.state.loading
                ? "Loading.."
                : "Resend"}
            </Button>
          </form>
        )}
      </div>
    );
  }
}

export default Sendemailconfirmation;
