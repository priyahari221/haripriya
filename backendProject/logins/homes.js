let lastRowData = []; // Define lastRowData as an empty array

// Define refreshLastRow function in the global scope
function removeLastRow() {
  const my = document.getElementById("my"); // Assuming "my" is the ID of the container where you want to display the images

  my.innerHTML = "";
}


function refreshLastRow() {
  const my = document.getElementById("my"); // Assuming "my" is the ID of the container where you want to display the images
  
  // Clear existing content in the container
  my.innerHTML = '';

  if (lastRowData.length === 0) {
    // If lastRowData is empty, create a single div with the default image
    const div = document.createElement("div");
    div.textContent = "No Posts Yet";
    div.classList.add("no-posts-message"); // Add a class to the div
    my.appendChild(div);
  } else {
    // Loop for the last row
    for (let i = lastRowData.length - 1; i >= 0; i--) {
      if (lastRowData[i]) {
        // Create a new div element
        const div = document.createElement("div");
        div.className = "box boxEdit";
        div.id = i;
        
        // Create an image element
        const img = document.createElement("img");
        img.onerror = () => {
          img.src = "images/Default-image.png";
        };
        img.src = lastRowData[i].src;
        
        // Create a paragraph element with a name link
        const p = document.createElement("p");
        p.className = "postName"
        const nameLink = document.createElement("a");
        nameLink.href = "javascript:void(0)";
        nameLink.textContent = lastRowData[i].name;
        div.onclick = () => openPopup1(lastRowData[i], i);
        // p.appendChild(nameLink);
        
        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        
        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i> '; // Bootstrap trash icon
        deleteButton.className = "overlay-btn";
        deleteButton.addEventListener("click", (event) => deleteEvent(i, event));
        
        // Create edit button
        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="bi bi-pencil"></i> '; // Bootstrap pencil icon
        editButton.className = "overlay-btn";
        editButton.addEventListener("click", (event) => openEditOverlay(i, true, event));
        
        // Append buttons to the button container
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(document.createElement("br")); // Add line break
        buttonContainer.appendChild(deleteButton);
        
        // Append the image, paragraph, and buttons to the div
        div.appendChild(img);
        // div.appendChild(p);
        div.appendChild(buttonContainer);
        
        const likeContainer = document.createElement("div");
        likeContainer.className = "like-container";
        
        const likeIcon = document.createElement("span");
        likeIcon.className = "like-icon";
        likeIcon.innerHTML = '<i class="bi bi-hand-thumbs-up-fill"></i>';
        likeContainer.appendChild(likeIcon);
        
        const likeCount = document.createElement("span");
        likeCount.className = "like-count";
        likeCount.textContent = lastRowData[i].likes; // Use the like count from the database
        likeContainer.appendChild(likeCount);
        likeContainer.appendChild(p)
        // Append the like icon and count to the div
        div.appendChild(likeContainer);
        
        // Append the div to the container
        my.appendChild(div);
      }
    }
  }
}

function getImages() {
  console.log("initialize");
  const trending = document.getElementById("trending");
  const popular = document.getElementById("popular");

  lastRowData = [];

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var responseData = JSON.parse(this.responseText);
        var images = responseData.images;
        var users = responseData.users;
        console.log("Received images:", images);
        console.log("Received users:", users);

        for (let i = 0; i < Math.min(4, images.length); i++) {
          newElement(i, false, images, trending);
        }

        for (let i = 0; i < Math.min(4, users.length); i++) {
          newElement1(i, false, users, popular);
        }
      }
    }
  };
  xhttp.onerror = function () {
    console.error("Failed to make the request.");
  };
  xhttp.open("GET", "http://localhost:5000/sort", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + token); // Add the Authorization header
  xhttp.send();

  fetch("/sort/mypost", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched images:", data.images); // Log the fetched images
      lastRowData.push(...data.images); // Push the fetched images into lastRowData
      console.log("Updated lastRowData:", lastRowData); // Verify the updated lastRowData
      refreshLastRow(); // Update the UI with the new images
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
}

// function editEvent(editIndex) {
//   return function (event) {
//     event.preventDefault();

//     var loader = document.getElementById("loader");

//     // Add your edit logic here
//     var form = event.target;
//     var formData = new FormData(form);
//     var imageUrl = formData.get("url");
//     var newParagraphText = formData.get("description");

//     var tempImg = new Image();
//     var storedUsername = localStorage.getItem("username");
//     tempImg.onload = function () {
//       lastRowData[editIndex].src = imageUrl;

//       refreshLastRow(); // Update the UI with the new data
//       closePopup();
//     };
//     tempImg.onerror = function () {
//       if (isValidURL(imageUrl)) {
//         imageUrl = "./images/Default-image.png";
//         lastRowData[editIndex].src = imageUrl;
//         loadButton.disabled = false;
//         loader.style.display = "none";
//         closePopup();
//         refreshLastRow();
//       } else {
//         alert("Enter a valid URL");
//         loadButton.disabled = false;
//         loader.style.display = "none";
//       }
//     };

//     if (imageUrl) {
//       loader.style.display = "block";
//       tempImg.src = imageUrl;
//     }

//     if (newParagraphText != lastRowData[editIndex].text) {
//       lastRowData[editIndex].text = newParagraphText;
//       refreshLastRow(); // Update the UI with the new data
//       closePopup();
//     }

//     console.log("id : " + lastRowData[editIndex]);

//     // Send a PUT request to the backend API to update the image data
//     fetch(`/images/edit`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         id: lastRowData[editIndex]._id,
//         src: imageUrl,
//         text: newParagraphText,
//         name: lastRowData[editIndex].name,
//         likes: lastRowData[editIndex].likes,
//         username: storedUsername,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to update image data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Image data updated successfully:", data.image);
//         // Update the UI with the new data
//         lastRowData[editIndex].src = imageUrl;
//         lastRowData[editIndex].text = newParagraphText;
//         removeLastRow();
//         fetchMypost();
//         refreshLastRow();
//         closePopup();
//       })
//       .catch((error) => {
//         console.error("Error updating image data:", error);
//         // Handle the error
//         alert("Failed to update image data. Please try again.");
//       })
//       .finally(() => {
//         loader.style.display = "none"; // Hide the loader
//       });
//   };
// }
function editEvent(editIndex) {
  return function (event) {
    event.preventDefault();

    var loader = document.getElementById("loader");

    // Add your edit logic here
    var form = event.target;
    var formData = new FormData(form);
    var imageUrl = formData.get("url");
    var newParagraphText = formData.get("description");

    // Check if both imageUrl and newParagraphText are empty
    if (!(imageUrl && newParagraphText)) {
      alert("Both image URL and paragraph text cannot be empty.");
      return; // Exit the function early
    }

    var tempImg = new Image();
    var storedUsername = localStorage.getItem("username");
    tempImg.onload = function () {
      lastRowData[editIndex].src = imageUrl;

      refreshLastRow(); // Update the UI with the new data
      closePopup();
    };
    tempImg.onerror = function () {
      if (isValidURL(imageUrl)) {
        imageUrl = "./images/Default-image.png";
        lastRowData[editIndex].src = imageUrl;
        loadButton.disabled = false;
        loader.style.display = "none";
        closePopup();
        refreshLastRow();
      } else {
        alert("Enter a valid URL");
        loadButton.disabled = false;
        loader.style.display = "none";
      }
    };

    if (imageUrl) {
      loader.style.display = "block";
      tempImg.src = imageUrl;
    }

    if (newParagraphText != lastRowData[editIndex].text) {
      lastRowData[editIndex].text = newParagraphText;
      refreshLastRow(); // Update the UI with the new data
      closePopup();
    }

    console.log("id : " + lastRowData[editIndex]);

    // Send a PUT request to the backend API to update the image data
    fetch(`/images/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: lastRowData[editIndex]._id,
        src: imageUrl,
        text: newParagraphText,
        name: lastRowData[editIndex].name,
        likes: lastRowData[editIndex].likes,
        username: storedUsername,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update image data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Image data updated successfully:", data.image);
        // Update the UI with the new data
        lastRowData[editIndex].src = imageUrl;
        lastRowData[editIndex].text = newParagraphText;
        removeLastRow();
        fetchMypost();
        refreshLastRow();
        closePopup();
      })
      .catch((error) => {
        console.error("Error updating image data:", error);
        // Handle the error
        alert("Failed to update image data. Please try again.");
      })
      .finally(() => {
        loader.style.display = "none"; // Hide the loader
      });
  };
}


function deleteImage(imageId) {
  console.log(imageId);
  return fetch(`/images/${imageId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Image deleted successfully");
        return true;
      } else {
        console.error("Failed to delete image");
        return false;
      }
    })
    .catch((error) => {
      console.error("Error deleting image:", error);
      return false;
    });
}

function deleteEvent(deleteIndex, event) {
  event.stopPropagation();
  // Display a confirmation dialog before deleting
  if (confirm("Are you sure you want to delete?")) {
    // Delete the item if confirmed
    console.log("delete post");
    console.log(deleteIndex);

    // Retrieve the ID of the image to be deleted
    const imageId = lastRowData[deleteIndex]._id;

    // Call the deleteImage function with the imageId
    deleteImage(imageId)
      .then((deleted) => {
        if (deleted) {
          fetchMypost();
          closePopup();
        }
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
        // Handle the error
      });
  }
}
function fetchMypost() {
  fetch("/sort/mypost", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched images:", data.images); // Log the fetched images
      lastRowData = [];
      removeLastRow();
      lastRowData.push(...data.images); // Push the fetched images into lastRowData
      console.log("Updated lastRowData:", lastRowData); // Verify the updated lastRowData
      refreshLastRow(); // Update the UI with the new images
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
}

function addNewContent() {
  return function (event) {
    event.preventDefault();

    var loadButton = document.getElementById("loadButton");
    var loader = document.getElementById("loader");

    var form = event.target;
    var formData = new FormData(form);
    var imageUrl = formData.get("url");
    var paragraphText = formData.get("description");

    var tempImg = new Image();

    tempImg.onload = function () {
      console.log(imageUrl);
      var storedUsername = localStorage.getItem("username");

      console.log(storedUsername);
      // Send the new content to the backend
      fetch("addcontent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          src: imageUrl,
          text: paragraphText,
          name: `post_${lastRowData.length +1}`,
          likes: 0, // Initial likes count
          username: storedUsername,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          loadButton.disabled = false;
          loader.style.display = "none";
          closePopup();

          fetchMypost(); // This function should be implemented to fetch 'mypost' data
        })
        .catch((error) => {
          console.error("Error:", error);
          loadButton.disabled = false;
          loader.style.display = "none";
        });
    };

    tempImg.onerror = function () {
      alert("Please provide a valid image");
      loadButton.disabled = false;
      loader.style.display = "none";
      closePopup();
      return null;
    };

    if (imageUrl && paragraphText) {
      loadButton.disabled = true;
      loader.style.display = "inline-block";
      tempImg.src = imageUrl;
    } else {
      alert("Please provide both image URL and paragraph text ");
    }
  };
}

function isValidURL(url) {
  // Regular expression to check if the URL is valid
  var pattern = /^(ftp|http|https):\/\/[^ "]+$/;

  return pattern.test(url);
}

function formatFollowersCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M"; // Convert to million format
  } else {
    return count.toString(); // Return the count as is
  }
}

function newElement1(i, editable, data, loc) {
  // Create a new div element
  const div = document.createElement("div");
  div.className = "box";

  // Create an image element
  const img = document.createElement("img");
  img.onerror = () => {
    img.src = "images/Default-image.png";
  };
  img.src = data[i].profileImage;

  // Create a paragraph element with a name link
  const p = document.createElement("p");
  p.className = "postName"
  const nameLink = document.createElement("a");
  nameLink.href = "javascript:void(0)";
  nameLink.textContent = data[i].name;

  // Set up click event based on editable flag
  if (editable) {
    div.id = 0;
    div.className = "box boxEdit";
    div.onclick = () => openPopup1(data[i], i);
  } else {
    div.onclick = () => openPopup(data[i], popular);
  }

  p.appendChild(nameLink);
  div.appendChild(img);
  // div.appendChild(p);

  loc.appendChild(div);

  // Create followers icon and count elements
  const followersContainer = document.createElement("div");
  followersContainer.className = "followers-container";

  const followersIcon = document.createElement("span");
  followersIcon.className = "followers-icon";
  followersIcon.innerHTML = '<i class="bi bi-people-fill"></i>'; // Person icon
  followersContainer.appendChild(followersIcon);

  const followersCount = document.createElement("span");
  followersCount.className = "followers-count";
  // followersCount.textContent = data[i].followers; // Assuming data[i].followers contains the followers count
  followersCount.textContent = formatFollowersCount(data[i].followers);
  followersContainer.appendChild(followersCount);
  followersContainer.appendChild(p);

  // Append the followers icon and followers count to the div
  div.appendChild(followersContainer);
}

function newElement(i, editable, data, loc) {
  // Create a new div element
  const div = document.createElement("div");
  div.className = "box";

  // Create an image elements
  const img = document.createElement("img");
  img.onerror = () => {
    img.src = "images/Default-image.png";
  };
  img.src = data[i].src;
  // console.log(data);
  // Create a paragraph element with a name link
  const p = document.createElement("p");
  p.className = "postName"
  const nameLink = document.createElement("a");
  nameLink.href = "javascript:void(0)";
  nameLink.textContent = data[i].name;

  // Set up click event based on editable flag
  if (editable) {
    div.id = 0;
    div.className = "box boxEdit";
    // console.log(lastRowData[i]);
    div.onclick = () => openPopup1(data[i], i);
  } else {
    div.onclick = () => openPopup(data[i], trending);
  }

  // p.appendChild(nameLink);
  div.appendChild(img);
  // div.appendChild(p);

  loc.appendChild(div);

  // Create like icon and count elements
  const likeContainer = document.createElement("div");
  likeContainer.className = "like-container";

  const likeIcon = document.createElement("span");
  likeIcon.className = "like-icon";
  likeIcon.innerHTML = '<i class="bi bi-hand-thumbs-up-fill"></i>';
  likeContainer.appendChild(likeIcon);

  const likeCount = document.createElement("span");
  likeCount.className = "like-count";
  likeCount.textContent = data[i].likes; // Use the like count from the database
  likeContainer.appendChild(likeCount);
  likeContainer.appendChild(p);
  // Append the like icon and count to the div
  div.appendChild(likeContainer);
}

// Function to open popup with background blur
function openPopup(item, postType) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.innerHTML = "";

  // Create an image element
  const img = document.createElement("img");
  if (postType == trending) {
    img.onerror = () => {
      img.src = "images/Default-image.png";
    };
    img.src = item.src;
  } else if (postType == popular) {
    img.onerror = () => {
      img.src = "images/Default-image.png";
    };
    img.src = item.profileImage;
  } else console.error("invalid postType:", postType);

  // Create a paragraph element
  const p = document.createElement("p");
  p.textContent = item.text;
  // Append the image and paragraph to the popup content

  popupContent.appendChild(img);
  popupContent.appendChild(p);

  // Show the overlay and popup
  overlay.style.display = "block";
  popup.style.display = "flex";
}

// Function to open popup with background blur
function openPopup1(item, index) {
  console.log("Opening popup for item:", item);
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.innerHTML = "";

  // Create an image element
  const img = document.createElement("img");
  img.src = item.src;
  // Create a paragraph element
  const p = document.createElement("p");
  p.textContent = item.text;

  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="bi bi-trash"></i> '; // Bootstrap trash icon
  // deleteButton.textContent = "Delete";
  deleteButton.className = "overlay-btn";

  // deleteButton.id = `delete_${item.id}`; // Set button ID
  deleteButton.addEventListener("click", (event) => deleteEvent(index, event));

  // Create edit button
  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="bi bi-pencil"></i> '; // Bootstrap pencil icon
  // editButton.textContent = "Edit";
  editButton.className = "overlay-btn";
  // editButton.id = `edit_${item.id}`; // Set button ID
  editButton.addEventListener("click", (event) =>
    openEditOverlay(index, true, event)
  );

  // Append buttons to the button container
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(document.createElement("br")); // Add line break
  buttonContainer.appendChild(deleteButton);

  // Append the image, paragraph, and buttons to the popup content
  popupContent.appendChild(img);
  popupContent.appendChild(p);
  popupContent.appendChild(buttonContainer);

  // Show the overlay and popup
  overlay.style.display = "block";
  popup.style.display = "flex";
}

function openEditOverlay(index, editable = false, event) {
  if (editable) {
    event.stopPropagation();
  }
  console.log("edit");
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.innerHTML = "";

  var form = document.createElement("form");
  if (editable) {
    form.addEventListener("submit", editEvent(index));
  } else {
    form.addEventListener("submit", addNewContent());
  }

  var urlLabel = document.createElement("label");
  urlLabel.textContent = "URL:";
  form.appendChild(urlLabel);
  form.appendChild(document.createElement("br"));

  var urlInput = document.createElement("input");

  urlInput.type = "text";
  urlInput.name = "url";
  urlInput.placeholder = "Enter URL here";
  if (editable) {
    urlInput.value = lastRowData[index].src;
  }
  form.appendChild(urlInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  var descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description:";
  form.appendChild(descriptionLabel);
  form.appendChild(document.createElement("br"));

  var descriptionInput = document.createElement("textarea");
  descriptionInput.rows = "7";
  descriptionInput.cols = "70";
  descriptionInput.maxLength = "160";
  descriptionInput.name = "description";
  descriptionInput.placeholder = "Enter description here";
  if (editable) {
    const text = lastRowData[index].text;
    descriptionInput.textContent = text;
  }
  form.appendChild(descriptionInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  var btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";

  var submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Submit";
  submitButton.id = "loadButton";
  submitButton.className = "loadButton";

  var loader = document.createElement("div");
  loader.id = "loader";
  loader.className = "loader";

  submitButton.appendChild(loader);
  btnContainer.append(submitButton);

  form.appendChild(btnContainer);

  // Appending the form to the container
  popupContent.appendChild(form);

  // Show the overlay and popup
  overlay.style.display = "block";
  popup.style.display = "flex";
}

// Function to close the popup and remove background blur
function closePopup() {
  const popup = document.getElementById("popup");
  // Hide the overlay and popup
  overlay.style.display = "none";
  popup.style.display = "none";
}
function logout() {
  console.log("logout");
  if (confirm("Are you sure you want to logout?")) {
    //Clear token from local storage
    localStorage.removeItem("token");
    //clear usename from  local storage
    localStorage.removeItem("username");
    console.log("Logged out successfully!");
    // Redirect to another page
    window.location.href = "logins.html";
    // Remove the home page from browser history
    window.history.replaceState({}, document.title, "logins.html");
  }
}

var token;
window.onload = async function () {
  token = localStorage.getItem("token");
  var userInfo = document.getElementById("user-info");
  var storedUsername = localStorage.getItem("username"); // Correct the key to fetch the username
  console.log("home page loaded");
  if (token) {
    // Initialize any necessary functionality
    getImages();

    if (storedUsername) {
      userInfo.textContent = "Logged in as: " + storedUsername;
      // Fetch and display the profile image
      fetch(`/api/users/${storedUsername}/profileImage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Profile Image URL:", data.profileImage); // Log the profile image URL
          document.getElementsByClassName("profile-picture-box")[0].src =
            data.profileImage; // Display the profile image
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
      console.log("User is already logged in with token:", token);
    } else {
      console.log("Username not found in local storage.");
    }
  } else {
    // Redirect to login page if token is not present
    window.location.href = "logins.html";
  }
};
