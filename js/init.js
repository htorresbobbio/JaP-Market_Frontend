const CATEGORIES_URL =
  "https://japdevdep.github.io/ecommerce-api/category/all.json"
const PUBLISH_PRODUCT_URL =
  "https://japdevdep.github.io/ecommerce-api/product/publish.json"
const CATEGORY_INFO_URL =
  "https://japdevdep.github.io/ecommerce-api/category/1234.json"
const PRODUCTS_URL =
  "https://japdevdep.github.io/ecommerce-api/product/all.json"
const PRODUCT_INFO_URL =
  "https://japdevdep.github.io/ecommerce-api/product/5678.json"
const PRODUCT_INFO_COMMENTS_URL =
  "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json"
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json"

const showSpinner = () => document.getElementById("spinner-wrapper").style.display = "flex"

const hideSpinner = () => document.getElementById("spinner-wrapper").style.display = "none"

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

//Google Auth Logout
function onLoad() {
  gapi.load("auth2", function () {
    gapi.auth2.init();
  });
}

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log("Full Name: " + profile.getName());
  console.log("Given Name: " + profile.getGivenName());
  console.log("Family Name: " + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

  // After login redirect:
  window.location.href = "index.html";
}

function signOut() {
  var loggedWithGoogle = JSON.parse(sessionStorage.getItem("loggedWithGoogle"))
  if (loggedWithGoogle) {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(function () {
      console.log("User signed out.")
    })
  }
  sessionStorage.clear()
  localStorage.clear()
  sessionStorage.setItem("Visited", true)
  window.location.href = "index.html"
}

document.addEventListener("DOMContentLoaded", function (e) {
  // onLoad()
  userLogged = sessionStorage.getItem("User-Logged");
  let userName = document.getElementById("navbarDropdownMenuLink");
  let userPanel = document.getElementById("userPanel");
  let loginPanel = document.getElementById("loginPanel");
  if (userLogged) {
    userLogged = JSON.parse(userLogged);
    userName.innerText = userLogged.email;
    userPanel.style.display = "flex";
    loginPanel.style.display = "none";
  }
});
