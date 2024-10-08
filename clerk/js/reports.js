let currentPage = 1;


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
  const url = "http://152.42.243.189/waterworks/clerk/reports.php";
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));
  formData.append("accountId", sessionStorage.getItem("accountId"));

  axios.post(url, formData)
    .then((response) => {
      const records = response.data;
      console.log("Server response:", records);

      let totalPayAmount = 0;
      const tableRows = Array.isArray(records) && records.length > 0 ? records.map(record => {
        totalPayAmount += parseFloat(record.pay_amount);
        return `
          <tr>
            <td class="text-center">${record.con_lastname}, ${record.con_firstname}</td>
            <td class="text-center">${record.zone_name}</td>
            <td class="text-center">${record.or_num}</td>
            <td class="text-center">${record.pay_amount}</td>
          </tr>
        `;
      }).join('') : '';

      const html = `
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
            ${tableRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right"><strong>Total:</strong></td>
              <td class="text-center"><strong>${totalPayAmount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      `;

      document.getElementById("mainDiv").innerHTML = html;
      
      // Check if jQuery and DataTables are available
      if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#example').DataTable({
          ordering: false // Disable sorting for all columns
        });
      } else {
        console.warn("jQuery or DataTables is not loaded. Table functionality may be limited.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("mainDiv").innerHTML = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th class="text-center">NAME</th>
              <th class="text-center">ZONE</th>
              <th class="text-center">OR #</th>
              <th class="text-center">AMOUNT</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;
    });
};
const displayPaymentNotPaidReports = () => {
  const url = "http://152.42.243.189/waterworks/clerk/notpaid.php";
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));

  axios.post(url, formData)
    .then((response) => {
      const records = response.data;
      console.log(records);

      let totalBill = 0;
      const tableRows = Array.isArray(records) && records.length > 0 ? records.map(record => {
        totalBill += parseFloat(record.total_bill);
        return `
          <tr>
            <td class="text-center">${record.lastname}, ${record.firstname}</td>
            <td class="text-center">${record.zone_name}</td>
            <td class="text-center">${record.branch_name}</td>
            <td class="text-center">${record.total_bill}</td>
          </tr>
        `;
      }).join('') : '';

      const html = `
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
            ${tableRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right"><strong>Total:</strong></td>
              <td class="text-center"><strong>${totalBill.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      `;

      document.getElementById("mainDiv").innerHTML = html;
      
      // Check if jQuery and DataTables are available
      if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#example').DataTable({
          ordering: false // Disable sorting for all columns
        });
      } else {
        console.warn("jQuery or DataTables is not loaded. Table functionality may be limited.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("mainDiv").innerHTML = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th class="text-center">NAME</th>
              <th class="text-center">ZONE</th>
              <th class="text-center">BRANCH</th>
              <th class="text-center">AMOUNT</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;
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
  // Code to convert HTML table to Excel format
  var table = document.getElementById("mainDiv").querySelector("table");
  var html = table.outerHTML;
  var blob = new Blob([html], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "report.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// Execute onLoad function when the page is loaded
window.onload = function() {
  onLoad();
};



