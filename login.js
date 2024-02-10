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
  
                // Store user information in session storage
                sessionStorage.setItem("userType", usertype);
                sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
  
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
  
                window.open(sessionStorage.getItem("dashboardURL"), "_blank");
            } else {
                alert("Login Failed: " + response.data.message);
            }
        } catch (error) {
            alert("ERROR! - " + error.message);
        }
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
