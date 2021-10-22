import React from "react";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import Cookie from "js-cookie";
import moment from "moment";
import UserUpdate from "../components/Users/UserUpdate";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      listUsers: [],
      searchUser: "",
    };

    this.getUsers = this.getUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  getUsers() {
    const token = Cookie.get("token");
    token &&
      axios
        .get(
          "/users?_sort=username:DESC&username_contains=" +
            this.state.searchUser,
          {
            headers: {
              Authorization: "Bearer " + (token ? token : ""),
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            const usersMap = res.data.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.provider}</td>
                  <td>
                    <Checkbox disabled checked={item.confirmed} />
                  </td>
                  <td>
                    <Checkbox disabled checked={item.blocked} />
                  </td>
                  <td>{item.role.name}</td>
                  <td>{moment(item.created_at).format("DD/MM/yyyy HH:mm")}</td>
                  <td>{moment(item.updated_at).format("DD/MM/yyyy HH:mm")}</td>
                  <td>
                    <UserUpdate
                      id={item.id}
                      title='edit'
                      getUsers={this.getUsers}
                    />
                  </td>
                </tr>
              );
            });
            this.setState({ listUsers: usersMap });
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }
  componentDidMount() {
    this._isMounted = true;
    this.getUsers();
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
    this.getUsers();
  }
  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control my-5 w-25'
              name='searchUser'
              value={this.state.searchUser}
              onChange={this.handleChange}
            />
          </div>
        </form>
        <p>Nombres d'utilisateurs : {this.state.listUsers.length}</p>
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Confirmed</th>
              <th>Blocked</th>
              <th>Role</th>
              <th>Created at</th>
              <th>Updated at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.state.listUsers}</tbody>
        </table>
      </>
    );
  }
}
export default Users;
