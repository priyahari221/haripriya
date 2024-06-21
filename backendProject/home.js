




// Additional array for the last row
var lastRowData = [
    {
      src: "https://images.unsplash.com/photo-1542658003-978babd6de54?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG9yYW5nZSUyMGZsb3dlcnxlbnwwfHwwfHx8MA%3D%3D",
      text: "Bloom!",
      name: "post_1",
    },
    {
      src: "https://images.pexels.com/photos/3633950/pexels-photo-3633950.jpeg?auto=compress&cs=tinysrgb&w=600",
      text: "Travel",
      name: "post_2",
    },
    {
      src: "https://images.unsplash.com/photo-1508867743401-21ad68d105b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D",
      text: "Wanderlust",
      name: "post_3",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1703806517546-581595edd4e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMzN8fHxlbnwwfHx8fHw%3D",
      text: "Valentining",
      name: "post_4",
    },
  ];
  
  function initialize() {
    var d1;
  
    const container = document.getElementById("container");
    const trending = document.getElementById("trending");
    const popular = document.getElementById("popular");
    const my = document.getElementById("my");
    const overlay = document.getElementById("overlay");
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonData = JSON.parse(JSON.parse(xhttp.responseText));
  
        // displayData(data.data1, "trending");
        // displayData(data.data2, "popular");
        console.log(jsonData.data);
        var jsonparsed = jsonData; // Assign jsonData directly
        d1 = jsonparsed.data.data1;
        console.log(jsonparsed.data.data1);
        console.log(d1)
        // console.log(xhttp.responseText);
        for (let i = 0; i < d1.length; i++) {
          newElement(i, false, d1, trending);
        }
  
        for (let i = 0; i < d1.length; i++) {
          newElement(i, false, d1, popular);
        }
  
      }
    };
    xhttp.open("GET", "home.json", true);
    xhttp.send();
  
    // Get the container element
  
    // Loop through the data array and create divs with images and paragraphs
    // for (let i = 0; i < d1.length; i++) {
    //   newElement(i, false, data1, trending);
    // }
  
    // for (let i = 0; i < d1.length; i++) {
    //   newElement(i, false, data2, popular);
    // }
  
    // Loop for the last row
    for (let i = lastRowData.length - 1; i >= 0; i--) {
      if (lastRowData[i]) {
        // Create a new div element
        const div = document.createElement("div");
        div.className = "box boxEdit";
        div.id = i;
        // Create an image element
        const img = document.createElement("img");
        img.src = lastRowData[i].src;
  
        // Create a paragraph element with a name link
        const p = document.createElement("p");
        const nameLink = document.createElement("a");
        nameLink.href = "javascript:void(0)";
        nameLink.textContent = lastRowData[i].name;
        div.onclick = () => openPopup1(lastRowData[i], i);
        p.appendChild(nameLink);
  
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
        div.appendChild(p);
        div.appendChild(buttonContainer);
  
        // Append the div to the container
        my.appendChild(div);
      }
    }
  
  };
  
  
  function editEvent(editIndex) {
    return function (event) {
      event.preventDefault();
  
      var loader = document.getElementById("loader");
  
      // Add your edit logic here
      var form = event.target;
      var formData = new FormData(form);
      var imageUrl = formData.get("url");
      var newParagraphText = formData.get("description");
  
      var tempImg = new Image();
  
      tempImg.onload = function () {
        lastRowData[editIndex].src = imageUrl;
        refreshLastRow(); // Update the UI with the new data
        closePopup();
      };
      tempImg.onerror = function () {
        if (isValidURL(imageUrl)) {
          imageUrl= "./images/default.png";
          lastRowData[editIndex].src = imageUrl;
          loadButton.disabled = false; 
          loader.style.display = 'none'; 
          closePopup();
          refreshLastRow();
        } else{ 
          alert("Enter a valid URL");
          loadButton.disabled = false; 
          loader.style.display = 'none'; 
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
    };
  }
  function deleteEvent(deleteIndex, event) {
    event.stopPropagation();
    // Display a confirmation dialog before deleting
    if (confirm("Are you sure you want to delete?")) {
      // Delete the item if confirmed
      console.log("delete post");
  
      lastRowData.splice(deleteIndex, 1);
      document.getElementById(deleteIndex).remove();
  
      // Add your delete logic here
      for (let i = 0; i < Number(deleteIndex); i++) {
        const boxId = `${i}`;
        const box = document.getElementById(boxId);
        const a = box.querySelector("a");
        box.onclick = () => openPopup1(lastRowData[i], i);
        a.textContent = `post_${i + 1}`;
      }
  
      for (let i = Number(deleteIndex) + 1; i <= lastRowData.length; i++) {
        const boxId = `${i}`;
  
        const box = document.getElementById(boxId);
  
        const a = box.querySelector("a");
        a.textContent = `post_${boxId}`;
        box.onclick = () => openPopup1(lastRowData[i - 1], i - 1);
  
        box.id = `${i - 1}`;
      }
      closePopup();
    }
  }
  
  function addNewContent() {
    return function (event) {
      event.preventDefault();
  
      var loadButton = document.getElementById("loadButton");
      var loader = document.getElementById("loader");
  
      // Add your edit logic here
      var form = event.target;
      var formData = new FormData(form);
      var imageUrl = formData.get("url");
      var paragraphText = formData.get("description");
  
      var tempImg = new Image();
  
      tempImg.onload = function () {
        console.log(imageUrl);
        // Add new content to the last row
        lastRowData.push({
          src: imageUrl,
          text: paragraphText,
          name: `post_${lastRowData.length}`,
        });
        loadButton.disabled = false; 
        loader.style.display = 'none'; 
        closePopup();
        // Refresh the content of the last row
        refreshLastRow();
      };
  
      tempImg.onerror = function () {
        if (isValidURL(imageUrl)) {
          imageUrl= "./images/default.png"
          lastRowData.push({
            src: imageUrl,
            text: paragraphText,
            name: `post_${lastRowData.length}`,
          });
          loadButton.disabled = false; 
          loader.style.display = 'none'; 
          closePopup();
          refreshLastRow();
        } else {
          alert("Enter a valid URL");
          loadButton.disabled = false; 
          loader.style.display = 'none'; 
        }
      };
      
  
      if (imageUrl && paragraphText) {
        loadButton.disabled = true; 
        loader.style.display = 'inline-block';
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
  
  // Function to refresh the content of the last row
  function refreshLastRow() {
    // Get all box elements
    const boxes = document.querySelectorAll(".boxEdit");
  
    // Update the last row elements with the new data
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].id = lastRowData.length - 1 - i;
      const img = boxes[i].querySelector("img");
      const a = boxes[i].querySelector("a");
      img.src = lastRowData[lastRowData.length - 1 - i].src;
      a.textContent = `post_${lastRowData.length - i}`;
      boxes[i].onclick = () =>
        openPopup1(
          lastRowData[lastRowData.length - 1 - i],
          lastRowData.length - 1 - i
        );
    }
  
    const remaining = lastRowData.length - boxes.length;
    if (remaining > 0) {
      for (let i = remaining - 1; i >= 0; i--) {
        newElement(i, true);
      }
    }
  }
  
  function newElement(i, editable = false, data = lastRowData, loc = my) {
    // Create a new div element
    const div = document.createElement("div");
  
    div.className = "box";
  
    // Create an image element
    const img = document.createElement("img");
    img.src = editable ? lastRowData[i].src : data[i].src;
  
    // Create a paragraph element with a name link
    const p = document.createElement("p");
    const nameLink = document.createElement("a");
    nameLink.href = "javascript:void(0)";
    nameLink.textContent = editable ? `post_1` : data[i].name;
    if (editable) {
      div.id = 0;
      div.className = "box boxEdit";
      console.log(lastRowData[i]);
      div.onclick = () => openPopup1(lastRowData[i], i);
    } else {
      div.onclick = () => openPopup(data[i]);
    }
    p.appendChild(nameLink);
  
    // Append the image, paragraph, and button container to the div
    div.appendChild(img);
    div.appendChild(p);
  
    // Append the div to the container
    loc.appendChild(div);
  }
  
  // Function to open popup with background blur
  function openPopup(item) {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popup-content");
    popupContent.innerHTML = "";
  
    // Create an image element
    const img = document.createElement("img");
    img.src = item.src;
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
    editButton.addEventListener("click", (event) => openEditOverlay(index, true, event));
  
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
    event.stopPropagation();
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
    descriptionInput.placeholder = "Enter description here"
    if (editable) {
      const text = lastRowData[index].text;
      descriptionInput.textContent = text;
    }
    form.appendChild(descriptionInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
  
    var btnContainer = document.createElement("div");
    btnContainer.className = "btn-container"
  
    var submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    submitButton.id = "loadButton";
    submitButton.className = "loadButton";
  
    var loader = document.createElement("div");
    loader.id = "loader";
    loader.className = "loader";
  
    submitButton.appendChild(loader)
    btnContainer.append(submitButton)
  
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
      console.log("Logged out successfully!");
      // Redirect to another page
      window.location.href = "login.html";
    }
  }
  
  window.onload = function () {
    var token = localStorage.getItem("token");
    var userInfo = document.getElementById("user-info");
    var storedUsername = localStorage.getItem("token"); // Fetch the stored username from local storage
    console.log(token);
  
    if (token) {
      initialize();
      // Token found in local storage, user might be logged in
      // You can fetch user information from the server using the token
      if (storedUsername) {
        userInfo.textContent = "Logged in as: " + storedUsername; // Use stored username
        console.log("User is already logged in with token:", token);
      } else {
        console.log("Username not found in local storage.");
      }
    } else {
      window.location.href = "login.html";
    }
  };