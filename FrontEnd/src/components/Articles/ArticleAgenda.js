import React, { Component } from "react";
import ArticleUpdate from "./ArticleUpdate";
import axios from "axios";
import moment from "moment";
import Cookie from "js-cookie";

class ArticleAgenda extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      data: [],
      searchArticle: "",
    };

    this.getArticles = this.getArticles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.getArticles();
  }
  getArticles() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      axios
        .get(
          "/articles?_sort=start:DESC&title_contains=" +
            this.state.searchArticle,
          {
            headers: {
              Authorization: "Bearer " + (token ? token : ""),
            },
          }
        )
        .then((res) => {
          const articleMap = res.data.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{moment(item.start).format("DD/MM/yyyy HH:mm")}</td>
                <td>
                  <ArticleUpdate
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    getArticles={this.getArticles}
                    classProp='button-popup'
                  />
                </td>
              </tr>
            );
          });
          this.setState({ data: articleMap });
        })
        .catch((err) => {
          console.log(err);
        });
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.getArticles();
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control my-5 w-25'
              name='searchArticle'
              value={this.state.searchArticle}
              onChange={this.handleChange}
            />
          </div>
        </form>
        <p>Nombres d'articles : {this.state.data.length}</p>
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Date de publication</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.state.data}</tbody>
        </table>
      </div>
    );
  }
}

export default ArticleAgenda;
