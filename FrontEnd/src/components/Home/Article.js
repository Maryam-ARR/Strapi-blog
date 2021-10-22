import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import imageifNull from "../../Utils/Img/dummy-image.jpg";

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }
  render() {
    return (
      <article>
        <h2>
          <a href={"/articlemore/" + this.props.articles?.id}>
            {this.props.articles?.title}
          </a>
        </h2>
        <h3>{this.props.articles?.soustitle}</h3>
        <img
          alt='img'
          src={
            this.props.articles?.img?.url
              ? axios.defaults.baseURL + this.props.articles.img.url
              : imageifNull
          }
        />
        <p>{this.props.articles.description}</p>

        <Link to={"/articlemore/" + this.props.articles?.id}>
          <Button>Lire la suite</Button>
        </Link>
      </article>
    );
  }
}

export default Article;
