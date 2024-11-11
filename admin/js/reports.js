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
                        <th class="text-center">PAYMENT ID</th>
                        <th class="text-center">PAYMENT DATE&TIME</th>
                        <th class="text-center">NAME</th>
                        <th class="text-center">METER</th>
                        <th class="text-center">ADDRESS</th>
                        <th class="text-center">OR #</th>
                        <th class="text-center">OR DATE</th>
                        <th class="text-center">AMOUNT</th>
                      </tr>
                  </thead>
                  <tbody>
          `;
          let totalAmount = 0;
          records.forEach((record) => {
              html += `
                  <tr>
                      <td class="text-center">${record.payment_uniqueId}</td>
                      <td class="text-center">${record.pay_date}</td>
                      <td class="text-center">${record.con_lastname}, ${record.con_firstname}</td>
                      <td class="text-center">${record.meter_no}</td>
                      <td class="text-center">${record.zone_name}, ${record.barangay_name}</td>
                      <td class="text-center">${record.or_num}</td>
                      <td class="text-center">${record.or_date}</td>
                      <td class="text-center">${record.pay_amount}</td>
                  </tr>
              `;
              totalAmount += parseFloat(record.pay_amount);
          });
          html += `
                  </tbody>
                  <tfoot>
                      <tr>
                          <td colspan="7" class="text-right"><strong>Total:</strong></td>
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
function saveAsExcel() {
  // Get the table element
  var table = document.getElementById("mainDiv").querySelector("table");
  
  // Convert the table to a 2D array (rows and columns)
  var rows = [];
  for (var i = 0; i < table.rows.length; i++) {
    var row = [];
    for (var j = 0; j < table.rows[i].cells.length; j++) {
      row.push(table.rows[i].cells[j].innerText);
    }
    rows.push(row);
  }

  // Create a new workbook
  var wb = XLSX.utils.book_new();
  
  // Add the table rows to a new worksheet
  var ws = XLSX.utils.aoa_to_sheet(rows);

  // Initialize column widths array to ensure that it has the necessary structure
  ws['!cols'] = [];
  
  // Set each column width to 20.00 (20 characters wide)
  for (var i = 0; i < rows[0].length; i++) {
    ws['!cols'].push({ wch: 23 });
  }
  
  // Apply styles (center text, add borders)
  for (var R = 0; R < rows.length; R++) {
    for (var C = 0; C < rows[0].length; C++) {
      var cell = ws[XLSX.utils.encode_cell({r: R, c: C})];
      if (cell) {
        cell.s = {
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      }
    }
  }
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
  // Create an Excel file and prompt the download
  XLSX.writeFile(wb, "report.xlsx");
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



