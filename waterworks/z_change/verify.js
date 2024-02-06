const verify = () => {
    
  
    const code = document.getElementById("code").value;
    
    if (code === '' ) {
      alert('Fill in fields');
    } else {
        var url = "http://localhost/waterbilling/z_change/verify.php";
      const formData = new FormData();
      formData.append("code", code);
  
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
            var returnValue = response.data;
            console.log(returnValue);
          // Store user information in sessionStorage
          sessionStorage.setItem("Email", returnValue.email);
          window.location.href = "./change_password.html"; // Redirect to the customer page
        }
      }).catch(error => {
        alert("ERROR! - " + error);
      })
    }
  }
const verify1 = () => {
    
  
    const code = document.getElementById("code").value;
    
    if (code === '' ) {
      alert('Fill in fields');
    } else {
        var url = "http://localhost/waterbilling/z_change/verify1.php";
      const formData = new FormData();
      formData.append("code", code);
  
      axios({
        url: url,
        method: "post",
        data: formData
      }).then(response => {
        var returnValue = response.data;
        if (returnValue === 0 ) {
          alert("Invalid Code ");
        } else {
            var returnValue = response.data;
            console.log(returnValue);
          // Store user information in sessionStorage
          sessionStorage.setItem("Email", returnValue.email);
          window.location.href = "./change_password.html"; // Redirect to the customer page
        }
      }).catch(error => {
        alert("ERROR! - " + error);
      })
    }
  }