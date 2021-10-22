import axios from "axios";
import React from "react";
import Cookie from "js-cookie";
import { Button } from "@material-ui/core";
class InfoEdit extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      loading: false,
      tel: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      instagram: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      this._isMounted &&
      axios
        .get("/info/", {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          this.setState({
            tel: res.data.tel,
            facebook: res.data.facebook,
            twitter: res.data.twitter,
            linkedin: res.data.linkedin,
            youtube: res.data.youtube,
            instagram: res.data.instagram,
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      axios
        .put(
          "/info",
          {
            tel: this.state.tel,
            facebook: this.state.facebook,
            twitter: this.state.twitter,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
            instagram: this.state.instagram,
          },
          {
            headers: {
              Authorization: "Bearer " + (token ? token : ""),
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
            this.props.history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loading: false });
        });
  }
  render() {
    return (
      <div className='container-blog'>
        <h2 className='mb-3'>Modifier les Informations</h2>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Tel</label>
            <input
              type='text'
              className='form-control'
              name='tel'
              value={this.state.tel}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Facebook</label>
            <input
              type='text'
              className='form-control'
              name='facebook'
              value={this.state.facebook}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Twitter</label>
            <input
              type='text'
              className='form-control'
              name='twitter'
              value={this.state.twitter}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Linkedin</label>
            <input
              type='text'
              className='form-control'
              name='linkedin'
              value={this.state.linkedin}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Youtube</label>
            <input
              type='text'
              className='form-control'
              name='youtube'
              value={this.state.youtube}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Instagram</label>
            <input
              type='text'
              className='form-control'
              name='instagram'
              value={this.state.instagram}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <Button
              type='submit'
              className='button-tool'
              disabled={this.state.loading}>
              {this.state.loading ? "Loading... " : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
export default InfoEdit;
