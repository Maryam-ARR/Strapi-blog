import React from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Cookie from "js-cookie";

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      text: "",
      article: props.idArticle,
      userscomment: props.idUser,
    };

    this.getComments = props.getComments;
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
    const token = localStorage.getItem("token") || Cookie.get("token");
    if (token) {
      axios
        .post(
          "comments",
          {
            text: this.state.text,
            article: this.state.article,
          },
          {
            headers: {
              Authorization: "Bearer " + (token ? token : ""),
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false, text: "" });
            this.getComments();
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
    } else {
      this.setState({ loading: false, error: "you need to be connected" });
    }
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className='my-2'>
          <textarea
            type='text'
            className='form-control'
            name='text'
            value={this.state.text}
            onChange={this.handleChange}
            required
          />
        </div>
        <Button
          type='submit'
          className='button-tool'
          disabled={this.state.loading}>
          {this.state.loading ? "Loading... " : "Submit"}
        </Button>
        <div className='form-group invalid-feedback'>{this.state.error}</div>
      </form>
    );
  }
}

export default AddComment;
