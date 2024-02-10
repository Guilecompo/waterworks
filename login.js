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

              // Set flag indicating user is logged in
              sessionStorage.setItem("isLoggedIn", true);

              // Store user information in session storage
              sessionStorage.setItem("userType", usertype);
              sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
              
              // Set dashboard URL based on user type
              switch (usertype) {
                  case "Consumer":
                      sessionStorage.setItem("dashboardURL", "./consumer/html/dashboard.html");
                      break;
                  case "Admin":
                      sessionStorage.setItem("dashboardURL", "./admin/html/dashboard.html");
                      break;
                  case "Head":
                      sessionStorage.setItem("dashboardURL", "./head/html/dashboard.html");
                      break;
                  case "Clerk":
                      sessionStorage.setItem("dashboardURL", "./clerk/html/dashboard.html");
                      break;
                  case "Meter Reader":
                      sessionStorage.setItem("dashboardURL", "./meterreader/html/dashboard.html");
                      break;
                  default:
                      alert("Unknown usertype");
                      return;
              }
              
              // Redirect user to dashboard
              window.location.href = sessionStorage.getItem("dashboardURL");
          } else {
              alert("Login Failed: " + response.data.message);
          }
      } catch (error) {
          alert("ERROR! - " + error.message);
      }
  }
};

// Check if user is already logged in when the page loads
window.onload = function() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (isLoggedIn) {
      const dashboardURL = sessionStorage.getItem("dashboardURL");
      window.location.href = dashboardURL;
  }
};
