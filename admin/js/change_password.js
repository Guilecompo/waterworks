const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  document.getElementById("Name").innerText =
    sessionStorage.getItem("fullname");
  document.getElementById("Position").innerText =
    sessionStorage.getItem("positionName");
};

const change = () => {
  const password = document.getElementById("password").value;
  const retype_password = document.getElementById("retype_password").value;

  if (password === "" || retype_password === "") {
    alert("Fill in both fields");
  }
  if (password !== retype_password) {
    alert("Password not match");
  } else {
    var url = "http://localhost/waterworks/change_password.php";
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
  }
};
