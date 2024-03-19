let currentPage = 1;
let activities = [];
function onLoad() {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  displayActivity();
  getFileterBranch();
  getall();
}
const getall = () => {
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  const total_balance = document.getElementById('totalBalance');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay || !total_balance) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }
  const Url = "http://128.199.232.132/waterworks/admin/total.php";
    axios({
      url: Url,
      method: "post",
  })
  .then(response => response.data)  // Corrected line
  .then(data => {
    console.log('Response data:', data); // Log the response
    if (data && data.Total_Consumers !== undefined 
        && data.Total_Employees !== undefined 
        && data.Total_Consumed !== undefined
        && data.Total_Pay !== undefined
        && data.Total_Balance !== undefined
    ) {
        // Update the DOM with the retrieved data
        const totalPayValue = data.Total_Pay !== null ? data.Total_Pay : 0;
        const totalConsumersValue = data.Total_Consumers !== null ? data.Total_Consumers : 0;
        const totalEmployeesValue = data.Total_Employees !== null ? data.Total_Employees : 0;
        const totalConsumedValue = data.Total_Consumed !== null ? data.Total_Consumed : 0;
        const totalBalanceValue = data.Total_Balance !== null ? data.Total_Balance : 0;

        total_employees.innerText = totalEmployeesValue;

        total_consumers.innerText = totalConsumersValue;

        total_consumed.innerText = totalConsumedValue;

        total_balance.innerText = totalBalanceValue;
        
        total_pay.innerText = totalPayValue;
    } else {
        console.error('Invalid data format or missing properties in the response.');
    }
})

  .catch(error => {
      console.error('Error fetching data:', error);
      console.log(response.data);
  });
}
const getpoblacion = (selectedBranch) => {
  console.log("selected:", selectedBranch);
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }
  const Url = "http://128.199.232.132/waterworks/admin/total_poblacion.php";
  const formData = new FormData();
    formData.append("branchId", selectedBranch);
    axios({
      url: Url,
      method: "post",
      data: formData
  })
  .then(response => response.data)  // Corrected line
  .then(data => {
    console.log(data);
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
      console.log(error.response.data);
  });
}
const getmolugan = (selectedBranch) => {
  console.log("selected:", selectedBranch);
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }
  const Url = "http://128.199.232.132/waterworks/admin/total_poblacion.php";
  const formData = new FormData();
    formData.append("branchId", selectedBranch);
    axios({
      url: Url,
      method: "post",
      data: formData
  })
  .then(response => response.data)  // Corrected line
  .then(data => {
    console.log(data);
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
      console.log(error.response.data);
  });
}
// var data = {
//   labels: [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ],
//   datasets: [
//     {
//       label: "New Consumers",
//       borderColor: "rgb(75, 192, 192)",
//       data: [10, 20, 15, 25, 30, 10, 20, 15, 25, 30, 20, 10],
//       fill: false,
//     },
//   ],
// };

// // Chart configuration with responsive settings
// var config = {
//   type: "line",
//   data: data,
//   options: {
//     maintainAspectRatio: false,
//   },
// };

// Get the canvas element
// var ctx = document.getElementById("lineChart").getContext("2d");

// // Create the line chart
// var myChart = new Chart(ctx, config);

const getFileterBranch = () => {
  const branchSelect = document.getElementById("branch");
  var myUrl = "http://128.199.232.132/waterworks/admin/get_branch.php";

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
      console.log("Selected branch:",branchSelect);

      // Event listener for position change
      branchSelect.addEventListener("change", () => {
        const selectedBranch = branchSelect.value;
        
        // Call the appropriate display function based on the selected position
        if (selectedBranch === selectedBranch) {
          getpoblacion(selectedBranch);
        }  else if(selectedBranch === "employee"){
          getall();
        }
        // Add more conditions as needed for other positions
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const displayActivity = () => {
  var url = "http://128.199.232.132/waterworks/admin/activitylist.php";
  
  const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
  
  axios({
    url: url,
    method: "post",
    data: formData
  })
    .then((response) => {
      activities = response.data;
      console.log(activities);
  
      if (!Array.isArray(activities) || activities.length === 0) {
        errorTable();
      } else {
        showActivityPage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERRORSA! - " + error);
    });  
  };
const showNextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 10;
  const end = start + 10;
  const activitiesOnNextPage = activities.slice(start, end);

  if (activitiesOnNextPage.length > 0) {
    currentPage++;
    showActivityPage(currentPage);
  } else {
    alert("Next page is empty or has no content.");
    // Optionally, you can choose to disable the button here
    // For example, if you have a button element with id "nextButton":
    // document.getElementById("nextButton").disabled = true;
  }
};

const showPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    showActivityPage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};

const showActivityPage = (page, activitiesToDisplay = activities) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedActivities = activitiesToDisplay.slice(start, end);
  refreshTable(displayedActivities);
  showPaginationNumbers(page, Math.ceil(activitiesToDisplay.length / 10));
};

const showPaginationNumbers = (currentPage, totalPages) => {
  const paginationNumbersDiv = document.getElementById("paginationNumbers");
  let paginationNumbersHTML = "";

  const pagesToShow = 5; // Number of pages to display

  // Calculate start and end page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  // Adjust start and end page numbers if they are at the edges
  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  // Previous button
  paginationNumbersHTML += `<button  onclick="showPreviousPage()">Previous</button>`;

  // Generate page numbers
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationNumbersHTML += `<span class="active" onclick="goToPage(${i})">${i}</span>`;
    } else {
      paginationNumbersHTML += `<span onclick="goToPage(${i})">${i}</span>`;
    }
  }

  // Next button
  paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;

  paginationNumbersDiv.innerHTML = paginationNumbersHTML;
};

const goToPage = (pageNumber) => {
  showActivityPage(pageNumber);
};


const errorTable = () => {
  const mainDiv = document.getElementById("mainDivs");
  if (mainDiv) {
    var html = `
        <table class="table" >
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">In</th>
                </tr>
            </thead>
        </table>`;
    mainDiv.innerHTML = html;
  } else {
    console.error("Element with id 'mainDivs' not found.");
  }
};

const refreshTable = (activityList) => {
  const mainDiv = document.getElementById("mainDivs");
  if (mainDiv) {
    var html = `
        <table class="table mb-0 mt-0">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">In</th>
                </tr>
            </thead>
            <tbody>
        `;
    activityList.forEach((activity) => {
      html += `
            <tr>
                <td>${activity.firstname}  ${activity.lastname}</td>
                <td>${activity.activity_type}</td>
                <td>${activity.table_name}</td>
            </tr>
            `;
    });

    html += `</tbody></table>`;

    mainDiv.innerHTML = html;
  } else {
    console.error("Element with id 'mainDivs' not found.");
  }
};
