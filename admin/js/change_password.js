const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
      document.getElementById("ngalan").innerText =
          sessionStorage.getItem("fullname");
      document.getElementById("Name").innerText =
          sessionStorage.getItem("fullname");
      document.getElementById("Position").innerText =
          sessionStorage.getItem("positionName");
  }
};

const change = () => {
  const password = document.getElementById("password").value;
  const retype_password = document.getElementById("retype_password").value;

  if (password === "" || retype_password === "") {
      alert("Fill in both fields");
      return;
  }
  if (password !== retype_password) {
      alert("Password not match");
      return;
  }

  // Password validation regex pattern
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,12}$/;

  if (!passwordPattern.test(password)) {
      // Display modal with password requirements
      displayPasswordRequirementsModal();
      return;
  }

  var url = "http://128.199.232.132/waterworks/change_password.php";
  const formData = new FormData();
  formData.append("password", password);
  formData.append("email", sessionStorage.getItem("email"));
  formData.append("accountId", sessionStorage.getItem("accountId"));

  axios({
      url: url,
      method: "post",
      data: formData,
  })
  .then((response) => {
      var returnValue = response.data;
      if (returnValue === 0) {
          alert("Failed to change or Fill password again");
          //   verify1();
      } else {
          // Store user information in sessionStorage
          alert("Successfully Change ");
          window.location.href = "./change_password.html"; // Redirect to the customer page
      }
  })
  .catch((error) => {
    displayPasswordRequirementsModal();
    console.log(error);
  });
};

const displayPasswordRequirementsModal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
      <div style="background-color: #fff; border-radius: 10px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h3 style="color: #FF5733; text-align: center; margin-bottom: 10px;">Password Requirements</h3>
          <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
              <li style="color: #FF5733; margin-bottom: 5px;"><strong>Be 8 to 12 characters long</strong></li>
              <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one uppercase letter</strong></li>
              <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one lowercase letter</strong></li>
              <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one digit (0-9)</strong></li>
              <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one special character (!@#$%^&* etc.)</strong></li>
          </ul>
      </div>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};
