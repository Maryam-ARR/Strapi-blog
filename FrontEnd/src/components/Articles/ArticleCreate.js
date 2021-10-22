import React from "react";
import { TextField, Button, Snackbar } from "@material-ui/core";
import axios from "axios";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Cookie from "js-cookie";
import moment from "moment";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faTimes, faShareAltSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "@material-ui/lab/Alert";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";

class ArticleCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openS: false,
      openE: false,
      loading: false,
      id: "",
      title: "",
      soustitle: "",
      description: "",
      longdescription: "",
      start: moment().format("YYYY-MM-DDTHH:mm"),
      img: {},
      videourl: "",
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleDateChange(event) {
    this.setState({ start: event.target.value });
  }
  handleChange(event) {
    const name = event.target.name;
    if (event.target.files) {
      this.setState({
        [name]: event.target.files,
      });
    } else {
      this.setState({
        [name]: event.target.value,
      });
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const formData = new FormData();
    var data = this.state;
    this.state.img[0] &&
      formData.append("files.img", this.state.img[0], this.state.img[0].name);
    formData.append("data", JSON.stringify(data));
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      axios
        .post("/articles", formData, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              title: "",
              soustitle: "",
              description: "",
              longdescription: "",
              start: moment().format("YYYY-MM-DDTHH:mm"),
              img: {},
              videourl: "",
            });
            this.setState({ loading: false, openS: true, id: res.data.id });
          }
        })
        .catch((err) => {
          this.setState({ loading: false, openE: true });
          console.log(err);
        });
  }
  handleClose() {
    this.setState({ openE: false, openS: false });
  }
  handleShare() {
    return this.state.id ? "relative m-2 rounded-sm shadow-sm w-min" : "hidden";
  }
  render() {
    const url =
      process.env.REACT_APP_CLIENT_NAME + "/articlemore/" + this.state?.id;
    return (
      <div className='container-blog'>
        <h2>Ajouter un article</h2>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Titre</label>
            <input
              type='text'
              className='form-control'
              name='title'
              value={this.state.title}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Sous titre</label>
            <input
              type='text'
              className='form-control'
              name='soustitle'
              value={this.state.soustitle}
              onChange={this.handleChange}
            />
          </div>
          <div className='form-group'>
            <label>Idée générale</label>
            <input
              type='text'
              className='form-control'
              name='description'
              value={this.state.description}
              onChange={this.handleChange}
            />
          </div>
          <div className='form-group'>
            <label>Description</label>
            <textarea
              type='text'
              className='form-control'
              name='longdescription'
              value={this.state.longdescription}
              onChange={this.handleChange}></textarea>
          </div>
          <div className='form-group'>
            <label>Url de la video</label>
            <input
              type='text'
              className='form-control'
              name='videourl'
              value={this.state.videourl}
              onChange={this.handleChange}
            />
          </div>
          <div className='form-group'>
            <label>Date de publication</label>
            <div>
              <TextField
                type='datetime-local'
                defaultValue={this.state.start}
                value={this.state.start}
                onChange={this.handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </div>
          <div className='form-group'>
            <input
              id='contained-button-file'
              name='img'
              onChange={this.handleChange}
              style={{ display: "none" }}
              type='file'
            />
            <label htmlFor='contained-button-file'>
              <Button
                variant='contained'
                component='span'
                color='default'
                startIcon={<CloudUploadIcon />}>
                Upload
              </Button>
            </label>
          </div>
          <Button
            type='submit'
            className='button-tool'
            disabled={this.state.loading}>
            {this.state.loading ? "Loading... " : "Submit"}
          </Button>
        </form>
        <div className={this.handleShare()}>
          <FontAwesomeIcon
            icon={faShareAltSquare}
            className='absolute inset-0'
            size={50}
          />
          <div className='inline-flex m-3'>
            <FacebookShareButton url={url}>
              <FacebookIcon
                size={35}
                round={false}
                className='m-1'
                iconFillColor='#f8f9fa'
              />
            </FacebookShareButton>
            <TwitterShareButton url={url}>
              <TwitterIcon
                size={35}
                round={false}
                className='m-1'
                iconFillColor='#f8f9fa'
              />
            </TwitterShareButton>
            <LinkedinShareButton url={url}>
              <LinkedinIcon
                size={35}
                round={false}
                className='m-1'
                iconFillColor='#f8f9fa'
              />
            </LinkedinShareButton>
          </div>
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
            Article Crée !
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

export default ArticleCreate;
