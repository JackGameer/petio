import React from "react";
import { ReactComponent as Spinner } from "../assets/svg/spinner.svg";
import User from "../data/User";
import pjson from "../../package.json";
import { ReactComponent as TmdbLogo } from "../assets/svg/tmdb.svg";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      username: "",
      password: "",
    };

    this.loginForm = this.loginForm.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  inputChange(e) {
    const target = e.target;
    const name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  }

  loginForm(e) {
    e.preventDefault();
    let username = this.state.username;
    let password = this.state.password;
    this.login(username, password);
  }

  login(username, password, cookie = false) {
    if (/^\s/.test(username)) {
      this.props.msg({
        type: "error",
        message:
          "The username you entered contains a space before! Please remove it",
      });
      return;
    }
    if (/^\s/.test(password)) {
      this.props.msg({
        type: "error",
        message:
          "The password you entered contains a space before! Please remove it",
      });
      return;
    }
    this.setState({
      loading: true,
    });
    User.login(username, password, cookie, true)
      .then((res) => {
        this.setState({
          loading: false,
        });
        if (res.error && cookie) {
          this.props.msg({
            message: "Your session has expired please log in again",
            type: "error",
          });

          return;
        }

        if (res.error) {
          this.props.msg({
            message: "User Not Found",
            type: "error",
          });

          return;
        }

        if (res.loggedIn) {
          this.props.changeLogin(true);
        }
      })
      .catch((error) => {
        console.log(error);
        // Move this to error message
        this.props.msg({
          message:
            "There has been an error, Petio may be temporarily unavailable",
          type: "error",
        });

        localStorage.removeItem("petio_jwt");
      });
  }

  loginLocal() {
    if (localStorage.getItem("petio_jwt")) {
      if (localStorage.getItem("adminloggedin") === "true") {
        this.login("", false, true, true);
      } else {
        localStorage.removeItem("petio_jwt");
      }
    }
  }

  componentDidMount() {
    this.loginLocal();
  }

  render() {
    return (
      <div className="login-wrap">
        {!this.state.loading ? (
          <>
            <div className="login--inner">
              <h1 className="logo">
                Pet<span>io</span>
              </h1>
              <p className="main-title">Login</p>
              <p>Log in with your Plex username / password</p>
              <form onSubmit={this.loginForm} autoComplete="on">
                <p>Username</p>
                <input
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChange={this.inputChange}
                  autoComplete="username"
                />

                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.inputChange}
                  autoComplete="current-password"
                />

                <button className="btn btn__square">Login</button>
              </form>
            </div>
            <div className="credits">
              <a href="https://fanart.tv/" target="_blank" rel="noreferrer">
                <p>
                  <strong>FAN</strong>ART<span>.TV</span>
                </p>
              </a>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
              >
                <TmdbLogo />
              </a>
            </div>
            <p className="powered-by">
              Petio Admin build (alpha) {pjson.version}
            </p>
          </>
        ) : (
          <div className="spinner">
            <Spinner />
          </div>
        )}
      </div>
    );
  }
}

export default Login;
