const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    document.getElementById("Name").innerText = sessionStorage.getItem("fullname");
    document.getElementById("Position").innerText = sessionStorage.getItem("positionName");
  }
}

const change = () => {
  const password = document.getElementById("password").value;
  const retype_password = document.getElementById("retype_password").value;

  // Password validation regex pattern
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,12}$/;

  if (password === "" || retype_password === "") {
    failed_modal("Fill in both fields");
    return;
  }
  if (password !== retype_password) {
    failed_modal("Passwords do not match");
    return;
  }
  if (!passwordPattern.test(password)) {
    failed_modal("Password must be 8 to 12 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)");
    return;
  }

  var url = "http://152.42.243.189/waterworks/change_password.php";
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
        failed_modal1("Failed to change or Fill password again");
        //   verify1();
      } else {
        // Store user information in sessionStorage
        success_modal("Successfully Change ");
        // window.location.href = "./change_password.html"; // Redirect to the customer page
      }
    })
    .catch((error) => {
      error_modal("ERROR! - " + error);
    });
};

const success_modal = (message) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `<h5 class="modal-title" style="color: limegreen; text-align:center;">${message}</h5>`;
  $('#passwordIndicationModal').modal('show');
  setTimeout(() => {
    $('#passwordIndicationModal').modal('hide');
    window.location.href = "./change_password.html";
  }, 5000); // Auto close modal after 5 seconds
};

const failed_modal = (message) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `<div class="modal-title" style="color: red; text-align:center;">${message}</div>`;
  const modal = new bootstrap.Modal(document.getElementById('passwordIndicationModal'));
  modal.show();
};



const failed_modal1 = (message) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `<h5 class="modal-title" style="color: red; text-align:center;">${message}</h5>`;
  $('#passwordIndicationModal').modal('show');
};

const failed_modal3 = () => {
  const modalContent = document.getElementById("modalContent");
  const html = `
    <div style="background-color: #fff; border-radius: 10px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h3 style="color: #FF5733; text-align: center; margin-bottom: 10px;">Password Requirements</h3>
      <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
        <li style="color: #FF5733; margin-bottom: 5px;"><strong>Be 8 to 12 characters long</strong></li>
        <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one uppercase letter</strong></li>
        <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one lowercase letter</strong></li>
        <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one digit (0-9)</strong></li>
        <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one special character (!@#$%^&* etc.)</strong></li>
      </ul>
    </div>`;
  modalContent.innerHTML = html;
  $('#passwordIndicationModal').modal('show');
};

const error_modal = (message) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `<h5 class="modal-title" style="color: red; text-align:center;">${message}</h5>`;
  $('#passwordIndicationModal').modal('show');
};
