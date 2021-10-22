import React from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";

class ForgotPass extends React.Component {
  constructor(props) {
    super(props);
    this.appContext = this.props.appContext;
    this.state = {
      loading: false,
      email: "",
      error: "",
      sent: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      .post("/auth/forgot-password", {
        email: this.state.email,
      })
      .then((res) => {
        if (res.status === 200) {
          this.setState({ loading: false, sent: true });
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
          this.setState({ error, loading: false });
        }
        console.log(err);
      });
  }
  render() {
    return (
      <div className='container-blog'>
        {this.state.sent ? (
          <h2>Email Reset password Sent!</h2>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <h2>Forgot password</h2>
            <div className='form-group'>
              <label>Email</label>
              <input
                type='text'
                className='form-control'
                name='email'
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className='form-group'>{this.state.error}</div>
            <Button
              type='submit'
              className='button-tool'
              disabled={this.loading}>
              {this.state.loading ? "Loading.." : "Submit"}
            </Button>
          </form>
        )}
      </div>
    );
  }
}

export default ForgotPass;
