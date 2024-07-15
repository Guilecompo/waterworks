const verify = () => {
    
  
    const code = document.getElementById("code").value;
    
    if (code === '' ) {
      alert('Fill in fields');
    } else {
        var url = "http://152.42.243.189/waterworks/z_forgot/verify.php";
      const formData = new FormData();
      formData.append("code", code);
  
      axios({
        url: url,
        method: "post",
        data: formData
      }).then(response => {
        var returnValue = response.data;
        if (returnValue === 0 ) {
          failed_modal();
        //   verify1();
        } else {
            var returnValue = response.data;
            console.log(returnValue);
          // Store user information in sessionStorage
          sessionStorage.setItem("Email", returnValue.email);
          window.location.href = "change_pass.html"; // Redirect to the customer page
        }
      }).catch(error => {
        error_modal();
        console.log(error);
      })
    }
  }
  const failed_modal = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Invalid code</h5>
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
    window.location.reload();
    };
  