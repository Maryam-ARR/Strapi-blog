import React from "react";
import Article from "../components/Home/Article";
import axios from "axios";
import Fade from "react-reveal/Fade";
import FirstArticle from "../components/Home/FirstArticle";
import InfiniteScroll from "react-infinite-scroll-component";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.limit = 5;
    this.state = {
      firstArticle: {},
      articles: [],
      i: 1,
      count: 2,
      hasMore: true,
      openAlert: false,
    };
    this.getArticles = this.getArticles.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    axios
      .get("/articlesui/count")
      .then((res) => {
        this.setState({ count: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("/articlesui?_limit=" + 1 + "&_start=" + 0)
      .then((res) => {
        this.setState({
          firstArticle: res.data[0],
        });
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("/articlesui?&_limit=" + this.limit + "&_start=" + this.state.i)
      .then((res) => {
        const resultMap = res.data.map((item) => {
          return (
            <Fade bottom key={item.id}>
              <Article key={item.id} articles={item} />
            </Fade>
          );
        });
        this.setState({
          articles: [...this.state.articles, resultMap],
          i: this.state.i + this.limit,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getArticles = () => {
    if (this.state.i >= this.state.count) {
      this.setState({ hasMore: false, openAlert: true });
      return;
    }
    setTimeout(() => {
      axios
        .get("/articlesui?&_limit=" + this.limit + "&_start=" + this.state.i)
        .then((res) => {
          const resultMap = res.data.map((item) => {
            return (
              <Fade bottom key={item.id}>
                <Article key={item.id} articles={item} />
              </Fade>
            );
          });
          this.setState({
            articles: [...this.state.articles, resultMap],
            i: this.state.i + this.limit,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
  };
  handleClose() {
    this.setState({ openAlert: false });
  }
  render() {
    return (
      <>
        <FirstArticle firstArticle={this.state.firstArticle} />
        <InfiniteScroll
          className='container-article overflow-hidden'
          dataLength={this.state.articles.length}
          next={this.getArticles}
          hasMore={this.state.hasMore}
          loader={<div className='loading-small'></div>}
          scrollThreshold={1}
          endMessage={
            <Snackbar
              className='snackbar-fixed-articles'
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={this.state.openAlert}
              autoHideDuration={3000}
              onClose={this.handleClose}>
              <Alert
                className='alert-fixed'
                severity='info'
                icon={<FontAwesomeIcon icon={faCheckCircle} />}>
                Il n'y a plus d'articles !
              </Alert>
            </Snackbar>
          }>
          {this.state.articles}
        </InfiniteScroll>
      </>
    );
  }
}
export default Home;
