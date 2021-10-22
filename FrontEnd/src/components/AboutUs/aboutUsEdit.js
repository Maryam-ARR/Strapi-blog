import axios from "axios";
import React from "react";
import Modal from "react-modal";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookie from "js-cookie";
import { Button } from "@material-ui/core";

Modal.setAppElement("#root");

class ArticleUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.classProp = props.classProp;
    this._isMounted = false;
    this.state = {
      modalIsOpen: false,
      loading: false,
      aboutus: "",
    };
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.getAbout = props.getAbout;
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
        .get("/about-us/", {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          this.setState({
            aboutus: res.data?.about,
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
          "/about-us",
          { about: this.state.aboutus },
          {
            headers: {
              Authorization: "Bearer " + (token ? token : ""),
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
            this.closeModal();
            this.getAbout();
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loading: false });
          this.closeModal();
        });
  }
  render() {
    return (
      <div>
        <FontAwesomeIcon
          icon={faEdit}
          size='lg'
          className='float-right hover:opacity-30 cursor-pointer'
          onClick={this.openModal}
        />

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel='A Propos'>
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
                  <h2 className='mb-2'>A Propos</h2>
                  <div className='form-group'>
                    <textarea
                      type='text'
                      className='form-control aboutus'
                      name='aboutus'
                      value={this.state.aboutus}
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
            </div>
          </aside>
        </Modal>
      </div>
    );
  }
}
export default ArticleUpdate;
