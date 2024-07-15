const success_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
      <h5 class="modal-title " style="color: limegreen; text-align:center;">Code has been sent to your email</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";

  // Function to close modal and redirect
  const closeModalAndRedirect = () => {
      modal.style.display = "none";
      window.location.href = "verify.html";
  };

  // Event listener to handle modal closing
  modal.addEventListener('click', () => {
      closeModalAndRedirect();
  });

  // Close modal and redirect after 10 seconds
  setTimeout(closeModalAndRedirect, 10000);
};

  
const forgot = () => {
    const email = document.getElementById("email").value;
  
    if (email === '') {
        alert('Fill in username');
    } else {
        const url = "http://152.42.243.189/waterworks/z_forgot/forgot.php";
        sendForgotRequest(url, email);
    }
}

const sendForgotRequest = (url, email) => {
    const formData = new FormData();
    formData.append("email", email);
  
    axios({
        url: url,
        method: "post",
        data: formData
    }).then(response => {
        const returnValue = response.data;
        if (returnValue === 0) {
            failed_modal();
            console.log(email);
        } else {
            success_modal();
            sessionStorage.setItem("email", returnValue.email);
            // window.location.href = "verify.html";
        }
    }).catch(error => {
        error_modal();
        console.log("ERROR! - ", error);
    });
}

const failed_modal = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
    var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Invalid email</h5>
    `;
    modalContent.innerHTML = html;
    modal.style.display = "block";
}

const error_modal = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
    var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Unknown error occurred !</h5>
    `;
    modalContent.innerHTML = html;
    modal.style.display = "block";
}

const closeModal = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    window.location.reload();
}
