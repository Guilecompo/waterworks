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

  // Password validation regex pattern
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,12}$/;

  if (password === "" || retype_password === "") {
    alert("Fill in both fields");
    return;
  }
  if (password !== retype_password) {
    alert("Passwords do not match");
    return;
  }
  if (!passwordPattern.test(password)) {
    alert("Password must be 8 to 12 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)");
    return;
  }

  var url = "http://128.199.232.132/waterworks/change_password.php";
  const formData = new FormData();
  formData.append("password", password);
  formData.append("email", sessionStorage.getItem("email"));
  formData.append("accountId", sessionStorage.getItem("accountId"));

  console.log("new password", password);
  console.log("Email", sessionStorage.getItem("email"));
  console.log("accountId", sessionStorage.getItem("accountId"));

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
      alert("ERROR! - " + error);
    });
};

