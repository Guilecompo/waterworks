function onLoad() {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    getall();
    getSubmeter();
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
    const Url = `http://152.42.243.189/waterworks/consumer/total.php`;
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
  const getfilter = (selectedBranch) => {

    const total_consumed = document.getElementById('totalConsumed');
    
    const total_pay = document.getElementById('totalPay');

    const total_balance = document.getElementById('totalBalance');
  
    if (!total_consumed || !total_pay || !total_pay) {
      console.error('One or more required elements not found in the DOM.');
  
      console.log("Page loaded!");
      return;
    }
    const Url = `http://152.42.243.189/waterworks/consumer/filter_total.php`;
    const formData = new FormData();
      formData.append("accountId", selectedBranch);
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
  const getSubmeter = () => {
    const submeterSelect = document.getElementById("submeter");
    var myUrl = "http://152.42.243.189/waterworks/consumer/get_submeter.php";
    const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
    
    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
    .then((response) => {
      if (response && response.data) {
        if (response.data.message) {
          // Display an alert if the message exists
          // alert(response.data.message);
        } else {
          // Process the data if no message is returned
          var positions = response.data;
          console.log(positions);
  
          var options = `<option value="main">Main</option>`;
          positions.forEach((position) => {
            options += `<option value="${position.user_id}">${position.lastname} #${position.connected_number}</option>`;
          });
          submeterSelect.innerHTML = options;
  
          // Event listener for position change
          submeterSelect.addEventListener("change", () => {
            const selectedBranch = submeterSelect.value;
            // Call the appropriate display function based on the selected position
            if (selectedBranch !== "main") {
              getfilter(selectedBranch);
            } else {
              getall();
            }
            // Add more conditions as needed for other positions
          });
        }
      } else {
        // Handle unexpected response format
        alert("Unexpected response format");
      }
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
  };
  