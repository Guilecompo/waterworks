function onLoad() {
  document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }
  const Url = `http://localhost/waterworks/head/total.php`;
  const formData = new FormData();
    formData.append("branchId", sessionStorage.getItem("branchId"));
    axios({
      url: Url,
      method: "post",
      data: formData
  })
  .then(response => response.data)  // Corrected line
  .then(data => {
    console.log('Response data:', data); // Log the response
    if (data && data.Total_Consumers !== undefined 
        && data.Total_Employees !== undefined 
        && data.Total_Consumed !== undefined
        && data.Total_Pay !== undefined
    ) {
        // Update the DOM with the retrieved data
        const totalPayValue = data.Total_Pay !== null ? data.Total_Pay : 0;
        const totalConsumersValue = data.Total_Consumers !== null ? data.Total_Consumers : 0;
        const totalEmployeesValue = data.Total_Employees !== null ? data.Total_Employees : 0;
        const totalConsumedValue = data.Total_Consumed !== null ? data.Total_Consumed : 0;

        total_employees.innerText = totalEmployeesValue;

        total_consumers.innerText = totalConsumersValue;

        total_consumed.innerText = totalConsumedValue;
        
        total_pay.innerText = totalPayValue;
    } else {
        console.error('Invalid data format or missing properties in the response.');
    }
})

  .catch(error => {
      console.error('Error fetching data:', error);
  });
  
};
var data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [{
      label: 'New Consumers',
      borderColor: 'rgb(75, 192, 192)',
      data: [10, 20, 15, 25, 30, 10, 20, 15, 25, 30, 20, 10],
      fill: false,
  }]
};

// Chart configuration with responsive settings
var config = {
  type: 'line',
  data: data,
  options: {
      maintainAspectRatio: false,
  },
};

// Get the canvas element
var ctx = document.getElementById('lineChart').getContext('2d');

// Create the line chart
var myChart = new Chart(ctx, config);
