import React, { Component } from "react";
import Article from "../components/Home/Article";
import axios from "axios";
import Fade from "react-reveal/Fade";

class Recherche extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: props.location.articles || [],
      searchArticle: props.location.searchArticle || "",
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
    axios
      .get("/articlesui?title_contains=" + this.state.searchArticle)
      .then((res) => {
        if (res.status === 200) {
          const resultMap = res.data.map((item) => {
            return (
              <Fade bottom key={item.id}>
                <Article key={item.id} articles={item} />
              </Fade>
            );
          });
          this.setState({ articles: resultMap });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className='container-article'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control my-2 w-25'
              name='searchArticle'
              value={this.state.searchArticle}
              onChange={this.handleChange}
              required
            />
          </div>
        </form>

        {this.state.articles && this.state.articles.length !== 0 ? (
          <>{this.state.articles}</>
        ) : (
          <h1 className='text-center p-4'>Auncun article trouvé</h1>
        )}
      </div>
    );
  }
}

export default Recherche;
