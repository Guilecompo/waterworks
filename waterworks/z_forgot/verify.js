const verify = () => {
    
  
    const code = document.getElementById("code").value;
    
    if (code === '' ) {
      alert('Fill in fields');
    } else {
        var url = "http://localhost/waterworks/z_forgot/verify.php";
      const formData = new FormData();
      formData.append("code", code);
  
      axios({
        url: url,
        method: "post",
        data: formData
      }).then(response => {
        var returnValue = response.data;
        if (returnValue === 0 ) {
          alert("Invalid email / Email not registered");
        //   verify1();
        } else {
            var returnValue = response.data;
            console.log(returnValue);
          // Store user information in sessionStorage
          sessionStorage.setItem("Email", returnValue.email);
          window.location.href = "change_pass.html"; // Redirect to the customer page
        }
      }).catch(error => {
        alert("ERROR! - " + error);
      })
    }
  }