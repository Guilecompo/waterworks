const change = () => {
  const password = document.getElementById("password").value;
  const Cpassword = document.getElementById("Cpassword").value;

  // Password validation regex pattern
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  if (password === '' || Cpassword === '') {
      failed_modal();
      return;
  }
  if (password !== Cpassword) {
      failed_modal2();
      return;
  }
  if (!passwordPattern.test(password)) {
      failed_modal3();
      return;
  }

  var url = "http://128.199.232.132/waterworks/z_forgot/change_pass.php";
  const formData = new FormData();
  formData.append("password", password);
  formData.append("Email", sessionStorage.getItem("Email"));

  axios({
      url: url,
      method: "post",
      data: formData
  }).then(response => {
      var returnValue = response.data;
      if (returnValue === 0) {
          failed_modal1();
      } else {
          success_modal();
      }
  }).catch(error => {
      failed_modal();
      console.log(error);
  });
}


  const success_modal = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
    var html = `
        <h5 class="modal-title " style="color: limegreen; text-align:center;">Change Password Successfully</h5>
    `;
    modalContent.innerHTML = html;
    modal.style.display = "block";

    // Function to close modal and redirect
    const closeModalAndRedirect = () => {
        modal.style.display = "none";
        window.location.href = "/waterworks/";
    };

    // Event listener to handle modal closing
    modal.addEventListener('click', () => {
        closeModalAndRedirect();
    });

    // Close modal and redirect after 10 seconds
    setTimeout(closeModalAndRedirect, 10000);
};
const failed_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
var html = `
      <h5 class="modal-title " style="color: red; text-align:center;">Fill in both fields</h5>
  `;
    modalContent.innerHTML = html;
    modal.style.display = "block";

};
  const failed_modal1 = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Failed to change </h5>
    `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
  
  };
  const failed_modal2 = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Password not match </h5>
    `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
  
  };
  const failed_modal3 = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
    var html = `
    <div style="background-color: #fff; border-radius: 10px; padding: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <h3 style="color: #FF5733; text-align: center; margin-bottom: 10px;">Password Requirements</h3>
    <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
      <li style="color: #FF5733; margin-bottom: 5px;"><strong>Be 8 to 12 characters long</strong></li>
      <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one uppercase letter</strong></li>
      <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one lowercase letter</strong></li>
      <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one digit (0-9)</strong></li>
      <li style="color: #FF5733; margin-bottom: 5px;"><strong>Contain at least one special character (!@#$%^&* etc.)</strong></li>
    </ul>
  </div>
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
  