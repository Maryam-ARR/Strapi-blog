import React, { Component } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";

class ListImages extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
    this.getImages = this.getImages.bind(this);
  }
  getImages() {
    const token = Cookie.get("token");
    token &&
      axios
        .get("/upload/files?_sort=created_at:DESC", {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          this.setState({ files: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
  }
  componentDidMount() {
    this.getImages();
  }

  render() {
    const filesListMap = this.state.files.map((item) => (
      <Image key={item.id} item={item} getImages={this.getImages} />
    ));
    return (
      <>
        {filesListMap.length ? (
          <div>{filesListMap}</div>
        ) : (
          <h1 className='flex-center'>Aucune Image Disponible</h1>
        )}
      </>
    );
  }
}

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, item: props.item };
    this.handleDelete = this.handleDelete.bind(this);
    this.getImages = props.getImages;
  }
  handleDelete() {
    this.setState({ loading: true });
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      axios
        .delete("/upload/files/" + this.state.item.id, {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.getImages();
            this.setState({ loading: false });
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
  }
  render() {
    return (
      <div className='container-img ' key={this.state.item.id}>
        <Card className='card-ui'>
          <CardActionArea>
            <CardMedia
              className='media-ui'
              component='img'
              alt='Contemplative Reptile'
              height='140'
              image={axios.defaults.baseURL + this.state.item.url}
              title='Contemplative Reptile'
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {this.state.item.name}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                {this.state.item.ext} - {this.state.item.width}x
                {this.state.item.height} - {this.state.item.size}Kb
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='secondary'>
              <span
                type='button'
                onClick={this.handleDelete}
                disabled={this.state.loading}>
                {this.state.loading ? "Loading... " : "Delete"}
              </span>
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default ListImages;
