let currentPage = 1;
let employees = [];

// On Load
const onLoad = () => {
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId || accountId === "0") {
        window.location.href = "/waterworks/";
    } else {
        document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
        displayPaymentPaidReports(); // Default call to load initial data
        getFileterBranch(); // Load branches into the dropdown
    }
};

// Pagination
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

// Display Paid Reports
const displayPaymentPaidReports = (branchName = '') => {
    // document.getElementById("dateInput").value = "";
    const url = "http://152.42.243.189/waterworks/admin/reports.php";

    const formData = new FormData();
    formData.append('billingStatus', 'paid'); // Assuming 'paid' status
    if (branchName) {
        formData.append('branch', branchName);
    }

    axios.post(url, formData)
        .then((response) => {
            try {
                const records = response.data;
                console.log(records);
                let html = `
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
                document.getElementById("mainDiv").innerHTML = `<h2>No Records</h2>`;
                console.log(error);
            }
        }).catch((error) => {
            alert(`ERROR OCCURRED! ${error}`);
        });
};

// Display Not Paid Reports
const displayPaymentNotPaidReports = (branchName = '') => {
    // document.getElementById("dateInput").value = "";
    const url = "http://152.42.243.189/waterworks/admin/notpaid.php";

    const formData = new FormData();
    if (branchName) {
        formData.append('branch', branchName);
    }

    axios.post(url, formData)
        .then((response) => {
            try {
                const records = response.data;
                console.log(records);
                let html = `
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
                records.forEach((record) => {
                    html += `
                        <tr>
                            <td class="text-center">${record.lastname}, ${record.firstname}</td>
                            <td class="text-center">${record.zone_name}</td>
                            <td class="text-center">${record.branch_name}</td>
                            <td class="text-center">${record.total_bill}</td>
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
                document.getElementById("mainDiv").innerHTML = `<h2>No Records</h2>`;
                console.log(error);
            }
        }).catch((error) => {
            alert(`ERROR OCCURRED! ${error}`);
        });
};

// Printing Functionality
function printTable() {
    const tableContents = document.getElementById("mainDiv").querySelector("table").outerHTML;
    const printWindow = window;
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
    const table = document.getElementById("mainDiv").querySelector("table");
    const html = table.outerHTML;
    const blob = new Blob([html], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Filter by Date
function filterByDate() {
    try {
        const dateInput = document.getElementById("dateInput").value;
        console.log(dateInput);

        if (!dateInput) {
            alert("Please select a date first");
            return; // Exit the function
        }

        const url = "http://152.42.243.189/waterworks/admin/filter_reports.php";

        const formData = new FormData();
        formData.append("dateInput", dateInput);

        axios.post(url, formData)
            .then((response) => {
                try {
                    const records = response.data;
                    if (records && Array.isArray(records)) {
                        let html = `
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
                        document.getElementById("mainDiv").innerHTML = `<h2>No Records</h2>`;
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

// Filter by Branch
function filterByBranch() {
    try {
        const branchSelect = document.getElementById("branch");
        const branchName = branchSelect.value;

        if (branchName === "") {
            alert("Please select a branch");
            return; // Exit the function
        }

        filterByPaymentStatus(); // Apply the current payment status filter with branch
    } catch (error) {
        console.log("Error in branch filtering:", error);
    }
}

// Get Branches for the Dropdown
const getFileterBranch = () => {
  const url = "http://152.42.243.189/waterworks/admin/get_branch.php";
  axios.get(url)
      .then((response) => {
          try {
              const branches = response.data;
              const branchSelect = document.getElementById("branch");
              branchSelect.innerHTML = '<option value="">Select Branch</option>';
              branches.forEach((branch) => {
                  branchSelect.innerHTML += `<option value="${branch.branch_id}">${branch.branch_name}</option>`;
              });
          } catch (error) {
              console.log("Error loading branches:", error);
          }
      }).catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
          console.log("Axios Error:", error);
      });
};


// Get Branches for the Dropdown
// Filter by Branch
function filterByBranch() {
  try {
      const branchSelect = document.getElementById("branch");
      const branchId = branchSelect.value;

      if (branchId === "") {
          alert("Please select a branch");
          return; // Exit the function
      }

      // Update the filterByPaymentStatus function to use branchId
      filterByPaymentStatus(); // Apply the current payment status filter with branchId
  } catch (error) {
      console.log("Error in branch filtering:", error);
  }
}

// Update the filterByPaymentStatus function to include branchId
const filterByPaymentStatus = () => {
  const paymentStatus = document.getElementById("paymentStatus").value;
  const branchId = document.getElementById("branch").value;

  if (paymentStatus === "paid") {
      displayPaymentPaidReports(branchId);
  } else if (paymentStatus === "not_paid") {
      displayPaymentNotPaidReports(branchId);
  } else {
      document.getElementById("mainDiv").innerHTML = `<h2>Please select a payment status</h2>`;
  }
};

