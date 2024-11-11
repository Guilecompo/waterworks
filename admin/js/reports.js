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
  var url = "http://152.42.243.189/waterworks/admin/reports.php";

  axios({
      url: url,
      method: "post",
  }).then((response) => {
      try {
          var records = response.data;
          console.log(records);

          // Get the current month and year
          const currentMonth = new Date().toLocaleString('default', { month: 'long' });
          const currentYear = new Date().getFullYear();
          const title = `TOTAL COLLECTION FOR THE MONTH OF ${currentMonth.toUpperCase()} ${currentYear}`;

          // Construct the HTML with the title above the table
          var html = `
            <button id="exportExcelBtn" class="btn btn-primary mt-3">Export to Excel</button>
            <button id="printBtn" class="btn btn-secondary mt-3 ml-2">Print</button>
            <table id="example" class="table table-striped table-bordered" style="width:100%">
                <thead>
                    <tr>
                      <th class="text-center" colspan="8">${title}</th>
                    </tr>
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

          // Add event listener to the export button
          document.getElementById("exportExcelBtn").addEventListener("click", function() {
              exportToExcel(records, totalAmount, title);
          });

          // Add event listener to the print button
          document.getElementById("printBtn").addEventListener("click", function() {
              printTable();
          });
      } catch (error) {
          var html = "<h2>No Records</h2>";
          document.getElementById("mainDiv").innerHTML = html;
          console.log(error);
      }
  }).catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
  });
};
const printTable = () => {
  // Create a temporary print window
  var printWindow = window.open('', '', 'height=600,width=800');

  // Get the table HTML content
  var tableContent = document.getElementById("example").outerHTML;

  // Construct the print document HTML structure
  printWindow.document.write('<html><head><title>Print Report</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: Arial, sans-serif; }');
  printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
  printWindow.document.write('th, td { padding: 8px; border: 1px solid #ddd; text-align: center; }');
  printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
  printWindow.document.write('tfoot td { font-weight: bold; }');
  printWindow.document.write('</style></head><body>');
  
  // Add the title above the table
  var title = `TOTAL COLLECTION FOR THE MONTH OF ${new Date().toLocaleString('default', { month: 'long' }).toUpperCase()} ${new Date().getFullYear()}`;
  printWindow.document.write(`<h3 style="text-align: center;">${title}</h3>`);

  // Add the table HTML content
  printWindow.document.write(tableContent);
  printWindow.document.write('</body></html>');

  // Wait for the content to load and then print
  printWindow.document.close(); // Close the document to trigger printing
  printWindow.print(); // Open the print dialog
};


const exportToExcel = (records, totalAmount, title) => {
  // Create a new workbook
  var wb = XLSX.utils.book_new();

  // Prepare the table data for Excel (similar to the one displayed)
  var rows = [
      // Add the title row, which spans all columns
      [title, '', '', '', '', '', '', '']
  ];

  // Add the header row
  rows.push(['PAYMENT ID', 'PAYMENT DATE&TIME', 'NAME', 'METER', 'ADDRESS', 'OR #', 'OR DATE', 'AMOUNT']);

  // Add the record data
  records.forEach((record) => {
      rows.push([
          record.payment_uniqueId,
          record.pay_date,
          `${record.con_lastname}, ${record.con_firstname}`,
          record.meter_no,
          `${record.zone_name}, ${record.barangay_name}`,
          record.or_num,
          record.or_date,
          record.pay_amount
      ]);
  });

  // Add the total row (the last row)
  rows.push([
      'Total:', '', '', '', '', '', '', totalAmount.toFixed(2)
  ]);

  // Create the worksheet from the rows
  var ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
      { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 15 }
  ];

  // Apply text alignment, bold, and borders
  for (var R = 0; R < rows.length; R++) {
      for (var C = 0; C < rows[0].length; C++) {
          var cell = ws[XLSX.utils.encode_cell({r: R, c: C})];

          if (cell) {
              // Default alignment and borders for all cells
              cell.s = {
                  alignment: { horizontal: 'center', vertical: 'center' },
                  border: {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' }
                  }
              };

              // If the cell is in the first row (title row), merge and make it bold and larger font size
              if (R === 0) {
                  // Merge the cells for the title (from column 0 to column 7)
                  ws['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 7} }];
                  // Apply bold and font size 16 for the title
                  cell.s.font = { 
                      bold: true,  // Make text bold
                      sz: 16       // Font size 16 for the title
                  };
                  // Ensure the title is centered both horizontally and vertically
                  cell.s.alignment = { horizontal: 'center', vertical: 'center' };  
              }

              // If the cell is in the header row (column titles), make it bold
              if (R === 1) {
                  cell.s.font = { bold: true };
              }
          }
      }
  }

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Payment Report");

  // Generate the Excel file and prompt the download
  XLSX.writeFile(wb, "payment_report.xlsx");
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
                          <th class="text-center">METER</th>
                          <th class="text-center">ADDRESS</th>
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
                      <td class="text-center">${record.meter_no}</td>
                      <td class="text-center">${record.zone_name}, ${record.barangay_name}</td>
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
// function printTable() {
//   var tableContents = document.getElementById("mainDiv").querySelector("table").outerHTML;
//   var printWindow = window;
//   printWindow.document.body.innerHTML = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Print Table</title>
//         <style>
//           @media print {
//             body * {
//               visibility: hidden;
//             }
//             #print-content * {
//               visibility: visible;
//             }
//             #print-content {
//               position: absolute;
//               left: 0;
//               top: 0;
//             }
//             table {
//               border-collapse: collapse;
//               width: 100%;
//             }
//             th, td {
//               border: 1px solid #ddd;
//               padding: 8px;
//               text-align: left;
//             }
//             th {
//               background-color: #f2f2f2;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div id="print-content">
//           ${tableContents}
//         </div>
//       </body>
//     </html>
//   `;
//   printWindow.print();
//   printWindow.location.reload(); // Reload the page after printing
// }
// // Function to save content of mainDiv as Excel
// function saveAsExcel() {
//   // Get the table element
//   var table = document.getElementById("mainDiv").querySelector("table");
  
//   // Convert the table to a 2D array (rows and columns)
//   var rows = [];
//   for (var i = 0; i < table.rows.length; i++) {
//     var row = [];
//     for (var j = 0; j < table.rows[i].cells.length; j++) {
//       row.push(table.rows[i].cells[j].innerText);
//     }
//     rows.push(row);
//   }

//   // Check if there's a "Total" row and add it at the end if necessary
//   // Add a new row with a "Total" cell spanning 7 columns (assuming 7 columns in total)
//   var totalRow = [];
//   var totalCell = "Total"; // You can replace this with the actual total calculation logic
//   for (var i = 0; i < rows[0].length - 1; i++) {
//     totalRow.push(""); // Empty cells for the non-total columns
//   }
//   totalRow.push(totalCell); // The "Total" cell in the last column

//   // Add the "Total" row to the data array
//   rows.push(totalRow);
  
//   // Create a new workbook
//   var wb = XLSX.utils.book_new();
  
//   // Add the table rows to a new worksheet
//   var ws = XLSX.utils.aoa_to_sheet(rows);

//   // Initialize column widths array to ensure that it has the necessary structure
//   ws['!cols'] = [];
  
//   // Set each column width to 26.00 (26 characters wide)
//   for (var i = 0; i < rows[0].length; i++) {
//     ws['!cols'].push({ wch: 26 });
//   }
  
//   // Apply styles (center text, add borders)
//   for (var R = 0; R < rows.length; R++) {
//     for (var C = 0; C < rows[0].length; C++) {
//       var cell = ws[XLSX.utils.encode_cell({r: R, c: C})];
//       if (cell) {
//         cell.s = {
//           alignment: { horizontal: 'center', vertical: 'center' },
//           border: {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' }
//           }
//         };
//       }
//     }
//   }

//   // Merge the "Total" cell across all columns in the last row (assuming there are 7 columns)
//   ws['!merges'] = [
//     { s: { r: rows.length - 1, c: 0 }, e: { r: rows.length - 1, c: 6 } } // Merges from column 0 to 6 in the last row
//   ];

//   // Add the worksheet to the workbook
//   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
//   // Create an Excel file and prompt the download
//   XLSX.writeFile(wb, "report.xlsx");
// }


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



