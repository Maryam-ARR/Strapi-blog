import React from "react";
import axios from "axios";
import CountUp from "react-countup";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  componentDidMount() {
    axios
      .put("/visit-count/inc")
      .then((res) => {
        this.setState({ count: res.data.count });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <footer id='footer'>
        <div className='footerCont'>
          <div className='row'>
            Nombre de visite du jour :{" "}
            <CountUp end={Number(this.state.count)} duration={5} />
          </div>
          <div className='border-top'>
            <div className='row'>
              © 2020 <strong> Nour Chaoui </strong> • someting here • someting
              here
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
export default Footer;
