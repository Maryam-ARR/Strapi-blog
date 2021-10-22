import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import imageifNull from "../../Utils/Img/dummy-image.jpg";
import ReactPlayer from "react-player/youtube";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";

class ArticleDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
    };
  }
  componentDidMount() {
    axios
      .get("/articlesui/" + this.props.id)
      .then((res) => {
        this.setState({ article: res.data });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          this.props.history.push("/notfound");
        }
        console.log(err);
      });
  }
  render() {
    const url =
      process.env.REACT_APP_CLIENT_NAME + "/articlemore/" + this.props.id;
    return (
      <div className='container-blog flex flex-row'>
        <div className='flex flex-col justify-center m-3'>
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
        <article>
          <h1>{this.state.article.title}</h1>
          <h3>{this.state.article.soustitle}</h3>
          {this.state.article.img?.url ? (
            <img
              alt='img'
              src={
                this.state.article.img?.url
                  ? axios.defaults.baseURL + this.state.article.img.url
                  : imageifNull
              }
            />
          ) : (
            <></>
          )}
          <p className='text-justify whitespace-pre-line'>
            {this.state.article.description}
          </p>
          <p className='text-justify whitespace-pre-line'>
            {this.state.article.longdescription}
          </p>
          <div className='videourl'>
            {this.state.article.videourl ? (
              <ReactPlayer
                width='800px'
                height='450px'
                controls
                url={this.state.article.videourl}
              />
            ) : (
              <></>
            )}
          </div>
        </article>
      </div>
    );
  }
}

export default withRouter(ArticleDetails);
