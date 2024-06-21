//code for login popup and close popup

const wrapper = document.querySelector('.wrapper')
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const loginBtn = document.querySelector('#loginBtn');

btnPopup.addEventListener('click',()=>{
  // window.location.href="index.html";

    wrapper.classList.add('active-popup');
});
iconClose.addEventListener('click',()=>{
    wrapper.classList.remove('active-popup');
});
  
var loginform = document.getElementById('form');
loginform.addEventListener('submit',function (event) {
  event.preventDefault();

  const userName = document.getElementById("username").value;
  const passWord = document.getElementById("password").value;

  const usernameRegex = /^(?=.*[a-z]).{6,12}$/;
  onclick=validateLogin();

  function validateLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Username validation criteria
    const usernameRegex = /^(?=.*[a-z]).{6,12}$/;
    if (!usernameRegex.test(username)) {
      alert("Username must be 6-12 characters long and contain at least one lowercase letter.");
      return false;
    }
  
    // Password validation criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*<>]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be 8-16 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.");
      return false;
    }
  
    // If both username and password criteria are met
    return true;
  }
  
 const userCredentials = [
  { username: "haripriya", password: "Hari@priya1" },
  { username: "priyahari", password: "Priya$hari2" },
  { username: "dimpleicious", password: "Dimpleicious%3" }
];

//Check if provided credentials match any entry in the array
const isValidCredentials = userCredentials.some(credential => {
  return credential.username === userName && credential.password === passWord;
});

if (isValidCredentials) {
  localStorage.setItem("token", userName);
  console.log("Login successful!");
  window.location.href = "home.html";
} else {
  console.log("Invalid username or password");
  alert("Invalid Input");
  // Display error message or take appropriate action
}
});

// // Function to set a cookie
// function setCookie(name, value, days) {
//   const expires = new Date();
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
// }

// // Function to get a cookie value by name
// function getCookie(name) {
//   const cookieName = `${name}=`;
//   const decodedCookie = decodeURIComponent(document.cookie);
//   const cookieArray = decodedCookie.split(';');
//   for (let i = 0; i < cookieArray.length; i++) {
//     let cookie = cookieArray[i].trim();
//     if (cookie.indexOf(cookieName) === 0) {
//       return cookie.substring(cookieName.length, cookie.length);
//     }
//   }
//   return null;
// }

// //Check if provided credentials match any entry in the array
// const isValidCredentials = userCredentials.some(credential => {
//   return credential.username === userName && credential.password === passWord;
// });

// if (isValidCredentials) {
//   setCookie("token", userName, 1); // Set the token as a cookie with a lifespan of 1 day
//   console.log("Login successful!");
//   window.location.href = "index.html";
// } else {
//   console.log("Invalid username or password");
//   alert("Invalid Input");


// }
  function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.querySelector(".toggle-password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleButton.textContent = "Hide";
    } else {
      passwordInput.type = "password";
      toggleButton.textContent = "Show";
    }
  
   }
  






