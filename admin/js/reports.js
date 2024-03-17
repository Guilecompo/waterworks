let currentPage = 1;
let employees = [];


const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");

    displayPaymentReports();
};

const showNextPage = () => {
  currentPage++;
  showEmployeePage(currentPage);
};

const showPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    showEmployeePage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};

const displayPaymentReports = () => {
  var url = "http://128.199.232.132/waterworks/admin/reports.php";

  axios({
      url: url,
      method: "post",
  }).then((response) => {
      try {
          var records = response.data;
          console.log(records);
          var html = `
              <table id="example" class="table table-striped table-bordered" style="width:100%">
                  <thead>
                      <tr>
                          <th class="text-center">NAME</th>
                          <th class="text-center">ZONE</th>
                          <th class="text-center">OR #</th>
                          <th class="text-center">AMOUNT</th>
                      </tr>
                  </thead>
                  <tbody>
          `;
          records.forEach((record) => {
              html += `
                  <tr>
                      <td class="text-center">${record.con_lastname}, ${record.con_firstname}</td>
                      <td class="text-center">${record.zone_name}</td>
                      <td class="text-center">${record.or_num}</td>
                      <td class="text-center">${record.pay_amount}</td>
                  </tr>
              `;
          });
          html += `
                  </tbody>
              </table>
          `;
          document.getElementById("mainDiv").innerHTML = html;
          $('#example').DataTable({
              "ordering": false // Disable sorting for all columns
          });
      } catch (error) {
          var html = `<h2>No Records</h2>`;
          document.getElementById("mainDiv").innerHTML = html;
          console.log(error);
      }
  }).catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
  });
};

function printTable() {
  // Call displayPaymentReport to populate the table
  displayPaymentReport();

  // Wait for the content to be loaded
  setTimeout(() => {
      // Retrieve the content of the table
      var contentToPrint = document.getElementById("example_wrapper").outerHTML;
      
      // Create a new window for printing
      var printWindow = window.open('', '_blank');

      // Write the content and styles to the new window
      printWindow.document.write(`
          <html>
          <head>
              <title>Print</title>
              <link rel="stylesheet" type="text/css" href="printStyles.css">
          </head>
          <body>${contentToPrint}</body>
          </html>`
      );

      // Print the content
      printWindow.print();

      // Close the print window after printing
      printWindow.close();
  }, 1000); // Adjust the timeout as needed to ensure content is loaded before printing
}


const displayPaymentReport = () => {
  var url = "http://128.199.232.132/waterworks/admin/reports.php";

  axios({
      url: url,
      method: "post",
  }).then((response) => {
      try {
          var records = response.data;
          console.log(records);
          var html = `
              <table id="example" class="table table-striped table-bordered" style="width:100%">
                  <thead>
                      <tr>
                          <th class="text-center">NAME</th>
                          <th class="text-center">ZONE</th>
                          <th class="text-center">OR #</th>
                          <th class="text-center">AMOUNT</th>
                      </tr>
                  </thead>
                  <tbody>
          `;
          records.forEach((record) => {
              html += `
                  <tr>
                      <td class="text-center">${record.con_lastname}, ${record.con_firstname}</td>
                      <td class="text-center">${record.zone_name}</td>
                      <td class="text-center">${record.or_num}</td>
                      <td class="text-center">${record.pay_amount}</td>
                  </tr>
              `;
          });
          html += `
                  </tbody>
              </table>
          `;

          // Directly write the table HTML to the document body
          document.body.innerHTML = html;

          // Initialize DataTable without search, length menu, and pagination
          $('#example').DataTable({
              "ordering": false, // Disable sorting for all columns
              "searching": false, // Disable search box
              "lengthChange": false, // Disable entries per page menu
              "paging": false // Disable pagination
          });
      } catch (error) {
          console.log(error);
      }
  }).catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
  });
};


// Filter by Date Functionality
function filterByDate() {
  var filterBy = document.getElementById("filterBy").value;
  var dateInput = document.getElementById("dateInput").value;

  var url = "http://128.199.232.132/waterworks/admin/reports.php";
  
  // Modify the Axios request to include parameters for filtering
  axios({
      url: url,
      method: "post",
      data: {
          filterBy: filterBy,
          dateInput: dateInput
      }
  }).then((response) => {
      try {
          var records = response.data;
          console.log(records);
          var html = `
              <table id="example" class="table table-striped table-bordered" style="width:100%">
                  <thead>
                      <tr>
                          <th class="text-center">NAME</th>
                          <th class="text-center">ZONE</th>
                          <th class="text-center">OR #</th>
                          <th class="text-center">AMOUNT</th>
                      </tr>
                  </thead>
                  <tbody>
          `;
          records.forEach((record) => {
              html += `
                  <tr>
                      <td class="text-center">${record.con_lastname}, ${record.con_firstname}</td>
                      <td class="text-center">${record.zone_name}</td>
                      <td class="text-center">${record.or_num}</td>
                      <td class="text-center">${record.pay_amount}</td>
                  </tr>
              `;
          });
          html += `
                  </tbody>
              </table>
          `;
          document.getElementById("mainDiv").innerHTML = html;
          $('#example').DataTable({
              "ordering": false // Disable sorting for all columns
          });
      } catch (error) {
          var html = `<h2>No Records</h2>`;
          document.getElementById("mainDiv").innerHTML = html;
          console.log(error);
      }
  }).catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
  });
}

// Execute onLoad function when the page is loaded
window.onload = function() {
  onLoad();
};



