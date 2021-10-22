import React from "react";
import style from "antd/dist/antd.css";
import { Calendar } from "antd";
import ArticleUpdate from "./ArticleUpdate";
import axios from "axios";
import moment from "moment";
import Cookie from "js-cookie";

class ArticleCaldr extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: moment().format("YYYY-MM-DD"), data: [] };
    this.getData = this.getData.bind(this);
    this.getCalendar = this.getCalendar.bind(this);
  }
  componentDidMount() {
    this.getCalendar();
  }
  getCalendar() {
    const token = localStorage.getItem("token") || Cookie.get("token");
    token &&
      axios
        .get("/articles", {
          headers: {
            Authorization: "Bearer " + (token ? token : ""),
          },
        })
        .then((res) => {
          this.setState({ data: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
  }
  getData(value) {
    const list = this.state.data.filter((item) => {
      return (
        moment(item.start).isSame(value, "year") &&
        moment(item.start).isSame(value, "month") &&
        moment(item.start).isSame(value, "day")
      );
    });
    const data = list.map((item) => {
      return (
        <ArticleUpdate
          key={item.id}
          id={item.id}
          title={item.title}
          getCalendar={this.getCalendar}
          classProp='mui'
        />
      );
    });
    return data;
  }
  render() {
    return (
      <div className='flex-center' style={{ style }}>
        <Calendar dateCellRender={this.getData} />
      </div>
    );
  }
}
export default ArticleCaldr;
