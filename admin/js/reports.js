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

// Printing Functionality
// Printing Functionality
// Printing Functionality
function printTable() {
  // Hide dropdown entries, search, and pagination
  var table = $('#example').DataTable();
  table.search('').columns().search('').draw(); // Clear search filters
  table.settings()[0].oFeatures.bInfo = false; // Hide showing number entries
  table.settings()[0].oFeatures.bFilter = false; // Hide search
  table.settings()[0].oFeatures.bPaginate = false; // Hide pagination

  // Save content of mainDiv and hide it temporarily
  var mainDivContent = document.getElementById("mainDiv").innerHTML;
  document.getElementById("mainDiv").style.display = "none";

  // Print the content
  window.print();

  // Restore original table settings
  table.settings()[0].oFeatures.bInfo = true;
  table.settings()[0].oFeatures.bFilter = true;
  table.settings()[0].oFeatures.bPaginate = true;
  table.draw(); // Redraw table to apply changes

  // Restore content of mainDiv
  document.getElementById("mainDiv").innerHTML = mainDivContent;
  document.getElementById("mainDiv").style.display = "block";
}


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



