function onLoad() {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    getall();
  }
};
  const getall = () => {
    const total_consumed = document.getElementById('totalConsumed');
    
    const total_pay = document.getElementById('totalPay');

    const total_balance = document.getElementById('totalBalance');
  
    if (!total_consumed || !total_pay || !total_pay) {
      console.error('One or more required elements not found in the DOM.');
  
      console.log("Page loaded!");
      return;
    }
    const Url = `http://128.199.232.132/waterworks/consumer/total.php`;
    const formData = new FormData();
      formData.append("accountId", sessionStorage.getItem("accountId"));
      axios({
        url: Url,
        method: "post",
        data: formData
    })
    .then(response => response.data)  // Corrected line
    .then(data => {
      if (data && data.Total_Consumed !== undefined
          && data.Total_Pay !== undefined && data.Total_Balance !== undefined
      ) {
          
          const totalPayValue = data.Total_Pay !== null ? data.Total_Pay : 0;
          const totalConsumedValue = data.Total_Consumed !== null ? data.Total_Consumed : 0;
          const totalBalanceValue = data.Total_Balance !== null ? data.Total_Balance : 0;

          total_consumed.innerText = totalConsumedValue;
          
          total_pay.innerText = totalPayValue;
          
          total_balance.innerText = totalBalanceValue;
      } else {
          console.error('Invalid data format or missing properties in the response.');
      }
  })
  
    .catch(error => {
        console.error('Error fetching data:', error);
    });

  }