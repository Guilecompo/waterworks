const login = async () => {
  const url = "http://localhost/waterworks/login.php";

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === '' || password === '') {
    alert('Fill in both username and password fields');
  } else {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(url, formData);

      if (response.data.success) {
        const { usertype, userDetails } = response.data;

        sessionStorage.setItem("isLoggedIn", true);

        // Store user information in sessionStorage
        sessionStorage.setItem("fullname", userDetails.firstname + ' ' + userDetails.lastname);
        sessionStorage.setItem("phone_no", userDetails.phone_no);
        sessionStorage.setItem("email", userDetails.email);
        sessionStorage.setItem("accountId", userDetails.user_id);

        // Redirect user to dashboard based on user type
        switch (usertype) {
          case "Consumer":
            sessionStorage.setItem("address", userDetails.zone_name + ', ' + userDetails.barangay_name + ', ' + userDetails.municipality_name);
            sessionStorage.setItem("location", userDetails.barangayId);
            sessionStorage.setItem("branchId", userDetails.branchId);
            sessionStorage.setItem("barangayId", userDetails.barangay_id);
            sessionStorage.setItem("branchName", userDetails.branch_name);
            sessionStorage.setItem("positionName", userDetails.position_name);
            sessionStorage.setItem("propertyId", userDetails.propertyId);
            sessionStorage.setItem("meter", userDetails.meter_no);
            window.location.href = "./consumer/html/dashboard.html";
            break;
          case "Admin":
            sessionStorage.setItem("address", userDetails.barangayName + ', ' + userDetails.municipalityName + ', ' + userDetails.provinceName);
            sessionStorage.setItem("branchId", userDetails.branchId);
            sessionStorage.setItem("branchName", userDetails.branch_name);
            sessionStorage.setItem("positionName", userDetails.position_name);
            sessionStorage.setItem("usernames", userDetails.username);
            sessionStorage.setItem("barangayId", userDetails.barangayId);
            window.location.href = "./admin/html/dashboard.html";
            break;
          case "Head":
            sessionStorage.setItem("branchId", userDetails.branchId);
            sessionStorage.setItem("branchName", userDetails.branch_name);
            sessionStorage.setItem("positionName", userDetails.position_name);
            window.location.href = "./head/html/dashboard.html";
            break;
          case "Clerk":
            sessionStorage.setItem("branchId", userDetails.branchId);
            sessionStorage.setItem("branchName", userDetails.branch_name);
            sessionStorage.setItem("positionName", userDetails.position_name);
            window.location.href = "./clerk/html/dashboard.html";
            break;
          case "Meter Reader":
            sessionStorage.setItem("branchId", userDetails.branchId);
            sessionStorage.setItem("branchName", userDetails.branch_name);
            sessionStorage.setItem("positionName", userDetails.position_name);
            window.location.href = "./meterreader/html/dashboard.html";
            break;
          default:
            alert("Unknown usertype");
        }
      } else {
        alert("Login Failed: " + response.data.message);
        console.log(response.data);
      }
    } catch (error) {
      alert("ERROR! - " + error.message);
    }
  }
};

window.onload = function() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (isLoggedIn) {
      const dashboardURL = sessionStorage.getItem("dashboardURL");
      window.location.href = dashboardURL;
  }
};

const inputs = document.querySelectorAll(".input");

function addClass() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function removeClass() {
  let parent = this.parentNode.parentNode;
  if (this.value === "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach(input => {
  input.addEventListener("focus", addClass);
  input.addEventListener("blur", removeClass);
});
