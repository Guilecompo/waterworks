function onLoad() {
  var accountId = sessionStorage.getItem("accountId");
  if (accountId && accountId !== "0") {
    var usertype = sessionStorage.getItem("usertype");
    switch (usertype) {
      case "Consumer":
        window.location.href = "./consumer/html/dashboard.html";
        break;
      case "Admin":
        window.location.href = "./admin/html/dashboard.html";
        break;
      case "Head":
        window.location.href = "./head/html/dashboard.html";
        break;
      case "Clerk":
        window.location.href = "./clerk/html/dashboard.html";
        break;
      case "Meter Reader":
        window.location.href = "./meterreader/html/dashboard.html";
        break;
      default:
        alert("Unknown usertype");
    }
  } 
}



const login = async () => {
  const url = "http://128.199.232.132//waterworks/login.php";

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("Fill in both username and password fields");
  } else {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(url, formData);
      //console.log(response);

      if (response.data.success) {
        const { usertype, userDetails } = response.data;
        console.log(response.data);

        // Store user information in sessionStorage
        sessionStorage.setItem("usertype", usertype);
        sessionStorage.setItem("fullname", userDetails.firstname + " " + userDetails.lastname);
        sessionStorage.setItem("email", userDetails.email);
        sessionStorage.setItem("accountId", userDetails.user_id);
        sessionStorage.setItem("branchId", userDetails.branchId);

        // Redirect based on user types
        switch (usertype) {
          case "Consumer":
            sessionStorage.setItem("location", userDetails.barangayId);
            sessionStorage.setItem("barangayId", userDetails.barangay_id);
            sessionStorage.setItem("branchName", userDetails.branch_name);
            sessionStorage.setItem("positionName", userDetails.position_name);
            sessionStorage.setItem("propertyId", userDetails.propertyId);
            sessionStorage.setItem("phone_no", userDetails.phone_no);
            sessionStorage.setItem("meter", userDetails.meter_no);
            sessionStorage.setItem("email", userDetails.email);
            window.location.href = "./consumer/html/dashboard.html";
            break;
          case "Admin":
            sessionStorage.setItem("barangayId", userDetails.barangayIds);
            window.location.href = "./admin/html/dashboard.html";
            break;
          case "Head":
            sessionStorage.setItem("barangayId", userDetails.barangayIds);
            window.location.href = "./head/html/dashboard.html";
            break;
          case "Clerk":
            sessionStorage.setItem("barangayId", userDetails.barangayIds);
            window.location.href = "./clerk/html/dashboard.html";
            break;
          case "Meter Reader":
            sessionStorage.setItem("barangayId", userDetails.barangayIds);
            window.location.href = "./meterreader/html/dashboard.html";
            break;
          default:
            alert("Unknown usertype");
        }
      } else {
        failed_modal();
        console.log(response.data);
      }
    } catch (error) {
      error_modal();
      console.log(error.message);
    }
  }
};

const failed_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
    <h5 class="modal-title " style="color: red; text-align:center;">Login Failed</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};

const error_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
    <h5 class="modal-title " style="color: red; text-align:center;">Unknown error occurred !</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};

const closeModal = () => {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
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

inputs.forEach((input) => {
  input.addEventListener("focus", addClass);
  input.addEventListener("blur", removeClass);
});
