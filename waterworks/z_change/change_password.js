const change = () => {
    
  
    const password = document.getElementById("password").value;
    const Cpassword = document.getElementById("Cpassword").value;
    
    if (password === '' || Cpassword === '' ) {
      alert('Fill in both fields');
    }
    if(password !== Cpassword){
        alert('Password not match');
    } else {
        var url = "http://localhost/waterbilling/z_change/change_password.php";
      const formData = new FormData();
      formData.append("password", password);
      formData.append("Email", sessionStorage.getItem("Email"));
  
      axios({
        url: url,
        method: "post",
        data: formData
      }).then(response => {
        var returnValue = response.data;
        if (returnValue === 0 ) {
          //alert("Invalid email / Email not registered");
          verify1();
        } else {
          // Store user information in sessionStorage
          alert("Successfully Change ");
          window.location.href = "../"; // Redirect to the customer page
        }
      }).catch(error => {
        alert("ERROR! - " + error);
      })
    }
  }
const change1 = () => {
    
  
    const password = document.getElementById("password").value;
    const Cpassword = document.getElementById("Cpassword").value;
    
    if (password === '' || Cpassword === '' ) {
      alert('Fill in both fields');
    }
    if(password !== Cpassword){
        alert('Password not match');
    } else {
        var url = "http://localhost/waterbilling/z_change/change_password1.php";
      const formData = new FormData();
      formData.append("password", password);
      formData.append("Email", sessionStorage.getItem("Email"));
  
      axios({
        url: url,
        method: "post",
        data: formData
      }).then(response => {
        var returnValue = response.data;
        if (returnValue === 0 ) {
          alert("Invalid email ");
        } else {
          // Store user information in sessionStorage
          alert("Successfully Change ");
          window.location.href = "../"; // Redirect to the customer page
        }
      }).catch(error => {
        alert("ERROR! - " + error);
      })
    }
  }