
const forgot = () => {
  const email = document.getElementById("email").value;

  if (email === '') {
      alert('Fill in username');
  } else {
      const url = "http://localhost/waterbilling/z_change/forgot.php";
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
          alert("Invalid email / Email not registered");
      } else {
          console.log(returnValue);
          sessionStorage.setItem("email", returnValue.email);
          alert("Code has been send to your email");
          window.location.href = "./verify.html";
      }
  }).catch(error => {
      alert("ERROR! - " + error);
  });
}

const forgot1 = () => {
  const email = document.getElementById("email").value;

  if (email === '') {
      alert('Fill in username');
  } else {
      const url = "http://localhost/waterbilling/z_change/forgot1.php";
      sendForgotRequest1(url, email);
  }
}

const sendForgotRequest1 = (url, email) => {
  const formData = new FormData();
  formData.append("email", email);

  axios({
      url: url,
      method: "post",
      data: formData
  }).then(response => {
      const returnValue = response.data;
      if (returnValue === 0) {
          alert("Invalid email / Email not registered");
      } else {
          console.log(returnValue);
          sessionStorage.setItem("email", returnValue.email);
          alert("Code has been send to your email");
          window.location.href = "./verify.html";
      }
  }).catch(error => {
      alert("ERROR! - " + error);
  });
}
