import React from "react";
import { Switch, Button } from "@material-ui/core";
import axios from "axios";
import Cookie from "js-cookie";
import Modal from "react-modal";

Modal.setAppElement("#root");
class UserUpdate extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.roles = [];
    this.state = {
      modalIsOpen: false,
      loading: false,
      id: props.id,
      username: "",
      email: "",
      provider: "",
      confirmed: "",
      blocked: "",
      roleid: "",
      created_at: "",
      updated_at: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getUsers = props.getUsers;
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
  async afterOpenModal() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      (await axios
        .get("/users-permissions/roles", {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          this.roles = res.data.roles;
        })
        .catch((err) => {
          console.log(err);
        }));
    token &&
      (await axios
        .get("/users/" + this.state.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          this.setState({
            username: res.data.username,
            email: res.data.email,
            provider: res.data.provider,
            confirmed: res.data.confirmed,
            blocked: res.data.blocked,
            roleid: res.data.role.id,
            created_at: res.data.created_at,
            updated_at: res.data.updated_at,
          });
        })
        .catch((err) => {
          console.log(err);
        }));
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
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    this.setState({
      [name]: value,
    });
  }
  handleSubmit(e) {
    this.setState({ loading: true });
    e.preventDefault();
    const token = Cookie.get("token");
    token &&
      axios
        .put(
          "users/" + this.state.id,
          {
            id: this.state.id,
            username: this.state.username,
            email: this.state.email,
            provider: this.state.provider,
            confirmed: this.state.confirmed,
            blocked: this.state.blocked,
            role: { id: this.state.roleid },
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
            this.closeModal();
            this.getUsers();
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
          this.closeModal();
        });
  }
  handleDelete() {
    this.setState({ loading: true });
    const token = Cookie.get("token");
    token &&
      axios
        .delete("/users/" + this.state.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
            this.closeModal();
            this.getUsers();
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
  }
  render() {
    const option = this.roles.map((item) => {
      return (
        <option value={item.id} key={item.id}>
          {item.name}
        </option>
      );
    });
    return (
      <div>
        <button className='button-popup' onClick={this.openModal}>
          Edit
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel='Update User'>
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
                  <h2>Modifier User</h2>
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
                      type='text'
                      className='form-control'
                      name='email'
                      value={this.state.email}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>Provider</label>
                    <input
                      type='text'
                      className='form-control'
                      name='provider'
                      value={this.state.provider}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>Confirmed</label>
                    <Switch
                      checked={this.state.confirmed}
                      onChange={this.handleChange}
                      color='default'
                      name='confirmed'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Bloked</label>
                    <Switch
                      checked={this.state.blocked}
                      onChange={this.handleChange}
                      color='default'
                      name='blocked'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Role</label>
                    <select
                      name='roleid'
                      className='form-control'
                      value={this.state.roleid ? this.state.roleid : 1}
                      onChange={this.handleChange}>
                      {option}
                    </select>
                  </div>
                  <div className='form-group'>
                    <Button
                      type='submit'
                      className='button-tool'
                      disabled={this.state.loading}>
                      {this.state.loading ? "Loading... " : "Submit"}
                    </Button>
                    <Button
                      type='button'
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
export default UserUpdate;
