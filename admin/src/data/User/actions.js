import { store } from "../store";
import * as types from "../actionTypes";
import * as api from "./api";

export function login(user, pass = false, cookie = false, admin) {
  return new Promise((resolve, reject) => {
    let username = user,
      password = pass;
    let authToken = false;
    if (cookie) {
      authToken = localStorage.getItem("petio_jwt");
    }

    api
      .login(username, password, admin, authToken)
      .then((data) => {
        if (data.user) {
          let ls_user = data.token;
          if (data.admin) {
            data.user.admin = true;
            localStorage.setItem("adminloggedin", true);
          } else {
            localStorage.setItem("adminloggedin", false);
          }
          if (data.loggedIn) {
            if (!cookie) {
              localStorage.setItem("petio_jwt", ls_user);
            }
            finalise({
              type: types.LOGIN,
              data: data,
            });
            resolve(data);
          } else {
            resolve({ error: "User not found" });
            localStorage.removeItem("petio_jwt");
            localStorage.removeItem("adminloggedin");
            return;
          }
        } else {
          resolve({ error: "User not found" });
          localStorage.removeItem("petio_jwt");
          localStorage.removeItem("adminloggedin");
        }
      })
      .catch((err) => {
        alert(err);
        reject("Error");
      });
  });
}

export function logout() {
  localStorage.removeItem("petio_jwt");
  localStorage.removeItem("adminloggedin");
  finalise({
    type: types.LOGOUT,
  });
}

export function getRequests(min = false) {
  return new Promise((resolve, reject) => {
    api.getRequests(min).then((data) => {
      if (data && !data.error) {
        resolve(
          finalise({
            type: types.GET_REQUESTS,
            requests: data,
          })
        );
      } else {
        reject("Error");
      }
    });
  });
}

function finalise(data = false) {
  if (!data) return false;
  return store.dispatch(data);
}
