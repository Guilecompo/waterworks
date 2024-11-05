let currentPage = 1;
let employees = [];


const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
     document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");

    displayPaymentPaidReports();
  }
 
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

const filterByPaymentStatus = () => {
  const paymentStatus = document.getElementById("paymentStatus").value;

  if (paymentStatus === "paid") {
    displayPaymentPaidReports();  // Display paid reports
  } else if (paymentStatus === "not_paid") {
    displayPaymentNotPaidReports();  // Display not paid reports
  } else {
    document.getElementById("mainDiv").innerHTML = `<h2>Please select a payment status</h2>`;
  }
};

const displayPaymentPaidReports = () => {
  // document.getElementById("dateInput").value = "";
  var url = "http://152.42.243.189/waterworks/admin/reports.php";

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
          let totalAmount = 0;
          records.forEach((record) => {
              html += `
                  <tr>
                      <td class="text-center">${record.con_lastname}, ${record.con_firstname}</td>
                      <td class="text-center">${record.zone_name}</td>
                      <td class="text-center">${record.or_num}</td>
                      <td class="text-center">${record.pay_amount}</td>
                  </tr>
              `;
              totalAmount += parseFloat(record.pay_amount);
          });
          html += `
                  </tbody>
                  <tfoot>
                      <tr>
                          <td colspan="3" class="text-right"><strong>Total:</strong></td>
                          <td class="text-center"><strong>${totalAmount.toFixed(2)}</strong></td>
                      </tr>
                  </tfoot>
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
const displayPaymentNotPaidReports = () => {
  // document.getElementById("dateInput").value = "";
  var url = "http://152.42.243.189/waterworks/admin/notpaid.php";

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
                          <th class="text-center">BRANCH</th>
                          <th class="text-center">AMOUNT</th>
                      </tr>
                  </thead>
                  <tbody>
          `;
          let totalAmount = 0;
          records.forEach((record) => {
              html += `
                  <tr>
                      <td class="text-center">${record.lastname}, ${record.firstname}</td>
                      <td class="text-center">${record.zone_name}</td>
                      <td class="text-center">${record.branch_name}</td>
                      <td class="text-center">${record.total_bill}</td>
                  </tr>
              `;
              totalAmount += parseFloat(record.total_bill);
          });
          html += `
                  </tbody>
                  <tfoot>
                      <tr>
                          <td colspan="3" class="text-right"><strong>Total:</strong></td>
                          <td class="text-center"><strong>${totalAmount.toFixed(2)}</strong></td>
                      </tr>
                  </tfoot>
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


// Printing Functionality
function printTable() {
  var tableContents = document.getElementById("mainDiv").querySelector("table").outerHTML;
  var printWindow = window;
  printWindow.document.body.innerHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Table</title>
        <style>
          @media print {
            body * {
              visibility: hidden;
            }
            #print-content * {
              visibility: visible;
            }
            #print-content {
              position: absolute;
              left: 0;
              top: 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          }
        </style>
      </head>
      <body>
        <div id="print-content">
          ${tableContents}
        </div>
      </body>
    </html>
  `;
  printWindow.print();
  printWindow.location.reload(); // Reload the page after printing
}
// Function to save content of mainDiv as Excel
function saveAsCSV() {
  // Get the table element
  var table = document.getElementById("example");
  if (!table) {
    alert("No table found to export.");
    return;
  }

  // Create an array to hold the CSV content
  var csvContent = [];

  // Get the table rows (skip the header row and include the data rows)
  var rows = table.querySelectorAll("tr");

  // Helper function to pad content to a fixed width
  function padToWidth(text, width) {
    // If text length is less than the width, pad with spaces; otherwise, truncate
    return text.length < width ? text + ' '.repeat(width - text.length) : text.substring(0, width);
  }

  // Loop through each row and extract the data
  rows.forEach(function(row, rowIndex) {
    var cells = row.querySelectorAll("th, td");
    var rowData = [];

    cells.forEach(function(cell) {
      var text = cell.textContent.trim();
      text = text.replace(/"/g, '""'); // Escape quotes

      // Wrap the text in quotes and pad to 30 characters
      rowData.push(`"${padToWidth(text, 30)}"`);
    });

    // Add the row to the CSV content if it's not empty
    if (rowData.length > 0) {
      csvContent.push(rowData.join(",")); // Join cells with commas
    }
  });

  // Calculate the total amount (sum the values in the last column)
  var totalAmount = 0;
  for (var i = 1; i < csvContent.length - 1; i++) { // Exclude the header and footer rows
    var cells = csvContent[i].split(",");
    var amount = parseFloat(cells[3].replace(/"/g, '').replace(",", "")); // Remove quotes and commas from the amount
    if (!isNaN(amount)) {
      totalAmount += amount;
    }
  }

  // Add the "Total" row at the end in the correct format
  var totalRow = `"Total:","",${padToWidth("", 30)},"${padToWidth(totalAmount.toFixed(2), 30)}"`;
  csvContent.push(totalRow);

  // Create a Blob object to save the CSV file
  var csvFile = new Blob([csvContent.join("\n")], { type: 'text/csv;charset=utf-8;' });

  // Create a link element to trigger the download
  var link = document.createElement("a");
  link.href = URL.createObjectURL(csvFile);
  link.download = "report.csv"; // Name the downloaded CSV file
  link.click();
}



function filterByDate() {
  try {
    var dateInput = document.getElementById("dateInput").value;
    console.log(dateInput);

    if (!dateInput) {
      alert("Please select a date first");
      return; // Exit the function
    }

    // Check if dateInput is valid (you can add your own validation logic here)

    var url = "http://152.42.243.189/waterworks/admin/filter_reports.php";

    const formData = new FormData();
    formData.append("dateInput", dateInput);

    axios({
      url: url,
      method: "post",
      data: formData,
    }).then((response) => {
      try {
        var records = response.data;
        if (records && Array.isArray(records)) {
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
        } else {
          var html = `<h2>No Records</h2>`;
          document.getElementById("mainDiv").innerHTML = html;
        }
      } catch (error) {
        console.log("Error processing response:", error);
      }
    }).catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
      console.log("Axios Error:", error);
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
}



// Execute onLoad function when the page is loaded
window.onload = function() {
  onLoad();
};



