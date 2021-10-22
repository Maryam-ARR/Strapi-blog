import React from "react";
import ArticleDetails from "../components/ArticleMore/ArticleDetails";
import ListComment from "../components/ArticleMore/ListComment";

class ArticleMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
    };
  }
  render() {
    return (
      <>
        <ArticleDetails id={this.state.id} />
        <ListComment id={this.state.id} />
      </>
    );
  }
}
export default ArticleMore;
