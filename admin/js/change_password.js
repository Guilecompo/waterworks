const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
    window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    document.getElementById("Name").innerText = sessionStorage.getItem("fullname");
    document.getElementById("Position").innerText = sessionStorage.getItem("positionName");
  }
};

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
    failed_modal3(); // Show password requirements modal
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
        failed_modal1("Failed to change password. Please try again.");
      } else {
        success_modal("Password successfully changed");
      }
    })
    .catch((error) => {
      error_modal("An error occurred. Please try again later.");
      console.error("ERROR!", error);
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
  modalContent.innerHTML = `<h5 class="modal-title" style="color: red; text-align:center;">${message}</h5>`;
  $('#passwordIndicationModal').modal('show');
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
      <h3 style="color: #FF
