import React, { useContext } from "react";
import style from "antd/dist/antd.css";
import {
  faThumbsUp as fasThumbsUp,
  faThumbsDown as fasThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as farThumbsUp,
  faThumbsDown as farThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import { Button, Badge } from "@material-ui/core";
import { Comment, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddComment from "./AddComment";
import AppContext from "../Context/context";
import axios from "axios";
import Cookie from "js-cookie";
import moment from "moment";

const ListComment = (props) => {
  const { user } = useContext(AppContext);
  return <ListCommentbtw {...props} style={{ style }} user={user} />;
};
class ListCommentbtw extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: props.id, comments: [] };
    this.user = props.user;
    this.getComments = this.getComments.bind(this);
  }
  componentDidMount() {
    this.getComments();
  }
  getComments() {
    axios
      .get(
        "/comments?_sort=created_at:DESC&_where[article.id]=" + this.state.id
      )
      .then((res) => {
        var commentsListMap = res.data.map((item) => (
          <CommentComp
            key={item.id}
            item={item}
            getComments={this.getComments}
            user={this.user}
          />
        ));
        this.setState({ comments: commentsListMap });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className='container-blog'>
        <h3>Comment</h3>
        <div>{this.state.comments}</div>
        <AddComment
          idArticle={this.state.id}
          idUser={this.user?.id}
          getComments={this.getComments}
        />
      </div>
    );
  }
}

class CommentComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      loading: false,
      loadingLike: false,
      likestate: "",
    };
    this.user = props.user;
    this.getComments = props.getComments;
    this.handleDelete = this.handleDelete.bind(this);
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
  }
  componentDidMount() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      axios
        .get(
          "/action-lists?users_permissions_user=" +
            this.user.id +
            "&comment=" +
            this.state.item.id,
          {
            headers: {
              Authorization: "Bearer " + (token ? token : ""),
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              likestate: res.data[0].action,
            });
          }
        })
        .catch((err) => {
          this.setState({ loadingLike: false });
          console.log(err);
        });
  }
  like() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token && this.setState({ loadingLike: true });
    token &&
      axios
        .get("/like/" + this.state.item.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              loadingLike: false,
              item: res.data,
              likestate: res.data.action_lists,
            });
          }
        })
        .catch((err) => {
          this.setState({ loadingLike: false });
          console.log(err);
        });
  }
  dislike() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token && this.setState({ loadingLike: true });
    token &&
      axios
        .get("/dislike/" + this.state.item.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              loadingLike: false,
              item: res.data,
              likestate: res.data.action_lists,
            });
          }
        })
        .catch((err) => {
          this.setState({ loadingLike: false });
          console.log(err);
        });
  }
  classThumbs() {
    return this.state.loadingLike ? "opacity-span" : "";
  }
  async handleDelete() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token && this.setState({ loading: true });
    token &&
      axios
        .delete("/comments/" + this.state.item.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
            this.getComments();
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
  }
  render() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    return (
      <div className='container-comment'>
        <Comment
          key={this.state.item.id}
          author={
            <span className='span-commnent'>
              {this.state.item.userscomment?.username}
            </span>
          }
          content={<p>{this.state.item.text}</p>}
          datetime={
            <Tooltip
              title={moment(this.state.item.published_at).format(
                "HH:mm DD/MM/yyyy"
              )}>
              <span>{moment(this.state.item.published_at).fromNow()}</span>
            </Tooltip>
          }>
          <div>
            <span
              className='span-thumbs'
              onClick={
                token && this.state.loadingLike === false ? this.like : () => {}
              }>
              {this.state.likestate === "liked" ? (
                <Badge badgeContent={this.state.item.likes} color='error'>
                  <FontAwesomeIcon
                    icon={fasThumbsUp}
                    size='lg'
                    className={this.classThumbs()}
                  />
                </Badge>
              ) : (
                <Badge badgeContent={this.state.item.likes} color='error'>
                  <FontAwesomeIcon
                    icon={farThumbsUp}
                    size='lg'
                    className={this.classThumbs()}
                  />
                </Badge>
              )}
            </span>
            <span
              className='span-thumbs'
              onClick={
                token && this.state.loadingLike === false
                  ? this.dislike
                  : () => {}
              }>
              {this.state.likestate === "disliked" ? (
                <Badge
                  badgeContent={this.state.item.dislikes}
                  color='error'
                  className='span-comment-dislike'>
                  <FontAwesomeIcon
                    className={this.classThumbs()}
                    icon={fasThumbsDown}
                    size='lg'
                  />
                </Badge>
              ) : (
                <Badge
                  badgeContent={this.state.item.dislikes}
                  color='error'
                  className='span-comment-dislike'>
                  <FontAwesomeIcon
                    icon={farThumbsDown}
                    size='lg'
                    className={this.classThumbs()}
                  />
                </Badge>
              )}
            </span>
            {this.user?.id === this.state.item.userscomment?.id ||
            this.user?.role?.name === "Admin" ? (
              <Button
                color='secondary'
                onClick={this.handleDelete}
                disabled={this.state.loading}>
                {this.state.loading ? "Loading... " : "Delete"}
              </Button>
            ) : (
              <></>
            )}
          </div>
        </Comment>
      </div>
    );
  }
}

export default ListComment;
