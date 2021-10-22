import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Popover, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import AppContext from "./Context/context";
import Article from "../components/Home/Article";
import axios from "axios";
import Cookie from "js-cookie";
import Fade from "react-reveal/Fade";
import MenuIcon from "@material-ui/icons/Menu";
import {
  faFacebook,
  faTwitter,
  faYoutube,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faSearch,
  faEllipsisV,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";

const logout = (props) => {
  Cookie.remove("token");
  localStorage.removeItem("token");
  delete window.__user;
  window.localStorage.setItem("logout", Date.now());
  props.history.push("/");
};

const Header = (props) => {
  const { user, setUser } = useContext(AppContext);
  return <Headerbtw {...props} user={user} setUser={setUser} />;
};

class Headerbtw extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.adminRef = React.createRef();
    this.menuRef = React.createRef();
    this.state = {
      isOpenPopover: null,
      isClickedAdmin: false,
      isClickedMenu: false,
      searchArticle: "",
      user: props.user,
      setUser: props.setUser,
      isFixed: {
        top: "37px",
        position: "absolute",
      },
      info: {},
    };
    this.handleClickAdmin = this.handleClickAdmin.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.handleSearchPopover = this.handleSearchPopover.bind(this);
    this.handleCLosePopover = this.handleCLosePopover.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getInfo = this.getInfo.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted &&
      window.addEventListener("scroll", this.handleScroll.bind(this));
    document.addEventListener(
      "mousedown",
      this.handleClickOutsideMenu.bind(this)
    );
    this.getInfo();
  }
  getInfo() {
    axios
      .get("/info")
      .then((res) => {
        if (res.status === 200) {
          this.setState({ info: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("scroll", this.handleScroll.bind(this));
    document.removeEventListener(
      "mousedown",
      this.handleClickOutsideMenu.bind(this)
    );
  }
  static getDerivedStateFromProps(props, state) {
    return {
      user: props.user,
    };
  }
  handleScroll() {
    const notfixed = {
      top: "37px",
      position: "absolute",
    };
    const fixed = {
      top: "0px",
      position: "fixed",
    };
    if (window.scrollY < 37) {
      this.setState({ isFixed: notfixed });
    } else {
      this.setState({ isFixed: fixed });
    }
  }
  handleToggleMenu() {
    if (this.state.isClickedMenu) {
      return "nav22";
    } else {
      return "nav22 hide-menu";
    }
  }
  handleClickMenu() {
    this.setState({ isClickedMenu: !this.state.isClickedMenu });
  }
  handleClickOutsideMenu = (event) => {
    if (
      this.menuRef.current?.contains(event.target) ||
      this.adminRef.current?.contains(event.target)
    )
      return;
    this.setState({ isClickedMenu: false, isClickedAdmin: false });
  };
  handleSearchPopover(event) {
    this.setState({ isOpenPopover: event.currentTarget });
  }
  handleIdPopover() {
    const id = this.state.isOpenPopover ? "simple-popover" : undefined;
    return id;
  }
  handleCLosePopover() {
    this.setState({ isOpenPopover: null });
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isOpenPopover: false });
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
          this.props.history.push({
            pathname: "/recherche",
            articles: resultMap,
            searchArticle: this.state.searchArticle,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleClickAdmin() {
    this.setState({ isClickedAdmin: !this.state.isClickedAdmin });
  }
  tel() {
    return "tel:" + this.state.info?.tel;
  }
  render() {
    return (
      <nav>
        <div className='nav1' id='nav1'>
          <div className='row'>
            <div className='nav1col1'>
              <a href={this.tel()} className='nav1sn'>
                <FontAwesomeIcon icon={faPhoneAlt} />
              </a>
              <a href={this.state.info?.facebook} className='nav1sn'>
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href={this.state.info?.twitter} className='nav1sn'>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href={this.state.info?.youtube} className='nav1sn'>
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href={this.state.info?.instagram} className='nav1sn'>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href={this.state.info?.linkedin} className='nav1sn'>
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>

            <div className='nav1col2'>
              <Link to='/aboutus' className='nav1link'>
                A propos
              </Link>
              {this.state.user ? (
                <>
                  <span className='nav1linkuser'>
                    {this.state.user.username}
                  </span>
                  <Link
                    to='/'
                    className='nav1linkb'
                    onClick={() => {
                      logout(this.props);
                      this.state.setUser(null);
                      this.setState({ user: null });
                    }}>
                    Se deconnecter
                  </Link>
                </>
              ) : (
                <>
                  <Link to='/signin' className='nav1link'>
                    Nous rejoindre
                  </Link>
                  <Link to='/login' className='nav1linkb'>
                    Se connecter
                  </Link>
                </>
              )}

              {this.state.user?.role?.name === "Admin" ? (
                <div className='inline-block' ref={this.adminRef}>
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className='nav1linkicon ml-2 cursor-pointer'
                    onClick={this.handleClickAdmin}
                  />
                  {this.state.isClickedAdmin ? (
                    <div className='flex flex-col items-center absolute top-9 right-0 bg-black z-110 px-4 rounded shadow-xl'>
                      <Link
                        to='/articles'
                        className='nav1link my-3'
                        onClick={this.handleClickAdmin}>
                        Articles
                      </Link>
                      <Link
                        to='/users'
                        className='nav1link my-3'
                        onClick={this.handleClickAdmin}>
                        Users
                      </Link>
                      <Link
                        to='/images'
                        className='nav1link my-3'
                        onClick={this.handleClickAdmin}>
                        Images
                      </Link>
                      <Link
                        to='/info'
                        className='nav1link my-3'
                        onClick={this.handleClickAdmin}>
                        Info
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div
          className='nav2'
          id='nav2'
          style={this.state.isFixed}
          ref={this.menuRef}>
          <IconButton
            edge={false}
            color='inherit'
            onClick={this.handleClickMenu}>
            <MenuIcon />
          </IconButton>
          <div className='nav21'>
            <ul>
              <li>
                <Link to='/'>Accueil</Link>
              </li>
              <li>
                <Link to='/conference'>Conference</Link>
              </li>
              <li>
                <Link to='/cour'>Cours</Link>
              </li>
              <li>
                <Link to='/livre'>Livre</Link>
              </li>
              <li className='searchIcon'>
                <span className='searchLi' onClick={this.handleSearchPopover}>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </li>
            </ul>

            <Popover
              id={this.handleIdPopover()}
              open={Boolean(this.state.isOpenPopover)}
              anchorEl={this.state.isOpenPopover}
              onClose={this.handleCLosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}>
              <Typography style={{ margin: "5px" }}>
                <span className='span-text'>Rechercher un article</span>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type='text'
                    className='form-control span-text'
                    name='searchArticle'
                    onChange={this.handleChange}
                    required
                  />
                </form>
              </Typography>
            </Popover>
          </div>
          <div className={this.handleToggleMenu()}>
            <ul>
              <li>
                <Link to='/'>Accueil</Link>
              </li>
              <li>
                <Link to='/conference'>Conference</Link>
              </li>
              <li>
                <Link to='/cour'>Cours</Link>
              </li>
              <li>
                <Link to='/livre'>Livre</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
