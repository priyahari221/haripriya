const wrapper = document.querySelector(".wrapper");
const btnPopupq = document.querySelector(".btnLogin-popup");
const imageBtn = document.querySelector(".btnLogin-popup1");
const iconClose = document.querySelector(".icon-close");
const loginBtn = document.querySelector("#loginBtn");

btnPopupq.addEventListener("click", () => {
  wrapper.classList.add("active-popup");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popup");
});

var loginform = document.getElementById("form");

loginform.addEventListener("submit", async function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!validateLogin(username, password)) {
    return;
  }

  const requestBody = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log(data);
    if (data.message === "Authentication successful") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      window.location.replace("homes.html");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});


function validateLogin(username, password) {
  const usernameRegex = /^(?=.*[a-z])(?!.*[A-Z]).{6,12}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*<>]).{8,16}$/;

  const isUsernameValid = usernameRegex.test(username);
  const isPasswordValid = passwordRegex.test(password);

  if (!isUsernameValid && !isPasswordValid) {
    alert("Both username and password are incorrect.");
    return false;
  }

  if (!isUsernameValid) {
    alert("Username must be 6-12 characters long and contain at least one lowercase letter.");
    return false;
  }

  if (!isPasswordValid) {
    alert("Password must be 8-16 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.");
    return false;
  }

  return true;
}


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
