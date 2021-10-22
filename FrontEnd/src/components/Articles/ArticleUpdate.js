import React from "react";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Cookie from "js-cookie";
import Modal from "react-modal";
import moment from "moment";

Modal.setAppElement("#root");

class ArticleUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.classProp = props.classProp;
    this._isMounted = false;
    this.state = {
      modalIsOpen: false,
      loading: false,
      id: props.id,
      title: props.title,
      soustitle: "",
      description: "",
      longdescription: "",
      start: "",
      img: {},
      videourl: "",
    };
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getArticles = props.getArticles;
    this.getCalendar = props.getCalendar;
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  afterOpenModal() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      this._isMounted &&
      axios
        .get("/articles/" + this.state.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          this.setState({
            title: res.data.title,
            soustitle: res.data.soustitle,
            description: res.data.description,
            longdescription: res.data.longdescription,
            start: moment(res.data.start).format("YYYY-MM-DDTHH:mm"),
            videourl: res.data.videourl,
            comments: res.data.comments,
            img: res.data.img,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };
  onClickOutside = (event) => {
    if (this.modal?.contains(event.target)) return;
    this.closeModal();
  };
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
      token &&
      axios
        .put("/articles/" + this.state.id, formData, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            if (this.classProp === "mui") {
              this.getCalendar();
            } else {
              this.getArticles();
            }
            this.setState({ loading: false });
            this.closeModal();
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loading: false });
          this.closeModal();
        });
  }
  handleDelete() {
    this.setState({ loading: true });
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      axios
        .delete("articles/" + this.state.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            if (this.classProp === "mui") {
              this.getCalendar();
            } else {
              this.getArticles();
            }
            this.setState({ loading: false });
            this.closeModal();
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
  }
  render() {
    return (
      <div>
        {this.classProp === "mui" ? (
          <Button
            color='primary'
            className='button-cald'
            onClick={this.openModal}>
            {this.state.title}
          </Button>
        ) : (
          <button className={this.classProp} onClick={this.openModal}>
            {this.state.title}
          </button>
        )}

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel='Update Article'>
          <aside
            tag='aside'
            role='dialog'
            tabIndex='-1'
            aria-modal='true'
            className='modal-cover'
            onClick={this.onClickOutside}
            onKeyDown={this.onKeyDown}>
            <div className='modal-area' ref={(n) => (this.modal = n)}>
              <button
                aria-label='Close Modal'
                aria-labelledby='close-modal'
                className='_modal-close'
                onClick={this.closeModal}>
                <span id='close-modal' className='_hide-visual'>
                  Close
                </span>
                <svg className='_modal-close-icon' viewBox='0 0 40 40'>
                  <path d='M 10,10 L 30,30 M 30,10 L 10,30' />
                </svg>
              </button>
              <div className='modal-body'>
                <form onSubmit={this.handleSubmit}>
                  <h2>Modifier un article</h2>
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
                  <div className='form-group'>
                    <Button
                      type='submit'
                      className='button-tool'
                      disabled={this.state.loading}>
                      {this.state.loading ? "Loading... " : "Submit"}
                    </Button>
                    <Button
                      type='submit'
                      className='button-danger'
                      onClick={this.handleDelete}
                      disabled={this.state.loading}>
                      {this.state.loading ? "Loading... " : "Delete"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </aside>
        </Modal>
      </div>
    );
  }
}
export default ArticleUpdate;
