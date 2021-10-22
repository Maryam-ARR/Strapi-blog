import React, { Component, useContext } from "react";
import axios from "axios";
import AppContext from "../components/Context/context";
import AboutUsEdit from "../components/AboutUs/aboutUsEdit";

const AboutUs = (props) => {
  const { user } = useContext(AppContext);
  return <AboutUsbtw {...props} user={user} />;
};

class AboutUsbtw extends Component {
  constructor(props) {
    super(props);
    this.user = props.user;
    this.state = {
      aboutus: "",
    };

    this.getAbout = this.getAbout.bind(this);
  }
  componentDidMount() {
    this.getAbout();
  }
  getAbout() {
    axios
      .get("/about-us")
      .then((res) => {
        if (res.status === 200) {
          this.setState({ aboutus: res.data?.about });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className='container mx-auto bg-white min-h-screen shadow-md p-4 mt-10'>
        {this.user?.role?.name === "Admin" ? (
          <AboutUsEdit getAbout={this.getAbout} />
        ) : (
          <></>
        )}
        <h1 className='mb-9'>A Propos</h1>
        <p className='text-justify whitespace-pre-line'>{this.state.aboutus}</p>
      </div>
    );
  }
}

export default AboutUs;
