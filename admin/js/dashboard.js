function onLoad() {
  function checkAuthentication() {
    // Make an AJAX request to your PHP script for authentication
    fetch('check_auth.php')
        .then(response => {
            if (!response.ok) {
                // If authentication fails, redirect to login page
                window.location.replace('/');
            } else {
                // If authentication succeeds, continue loading the dashboard
                console.log('Authentication successful');
                // You can optionally load additional data or perform other actions here
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            // Handle errors, e.g., display an error message to the user
        });
}
  
  document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
  getFileterBranch();
  getall();
  
};
const getall = () => {
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }


  // Fetch data from your PHP script
  fetch('http://localhost/waterworks/admin/total.php')
    .then(response => response.json())
    .then(data => {
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
}
const getpoblacion = () => {
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }


  // Fetch data from your PHP script
  fetch('http://localhost/waterworks/admin/total_poblacion.php')
    .then(response => response.json())
    .then(data => {
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
}
const getmolugan = () => {
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }


  // Fetch data from your PHP script
  fetch('http://localhost/waterworks/admin/total_molugan.php')
    .then(response => response.json())
    .then(data => {
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
}
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

const getFileterBranch = () => {
  const branchSelect = document.getElementById("branch");
  var myUrl = "http://localhost/waterworks/admin/get_branch.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var positions = response.data;

      var options = `<option value="employee">Select Branch</option>`;
      positions.forEach((position) => {
        options += `<option value="${position.branch_name}">${position.branch_name}</option>`;
      });
      branchSelect.innerHTML = options;

      // Event listener for position change
      branchSelect.addEventListener("change", () => {
        const selectedBranch = branchSelect.value;
        // Call the appropriate display function based on the selected position
        if (selectedBranch === "Poblacion") {
          getpoblacion();
        }else if (selectedBranch === "Molugan") {
          getmolugan();
        } else{
          getall();
        }
        // Add more conditions as needed for other positions
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};